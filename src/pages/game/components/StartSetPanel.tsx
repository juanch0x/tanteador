import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useStartSet } from "@/store/store";
import type { Match, MatchSet, TeamId } from "@/types/BaseTypes";

type ServeOption = TeamId | "random";

// ─── Reveal config — tweak here to change rhythm and feel ───────────────────
const SPIN_DELAYS_MS = [80, 80, 90, 100, 120, 150, 200, 270, 350, 450];
const SETTLED_HOLD_MS = 900;
// ────────────────────────────────────────────────────────────────────────────

type RevealPhase = "idle" | "spinning" | "settled";

function useServeReveal(onResolved: (winner: TeamId) => void) {
  const [phase, setPhase] = useState<RevealPhase>("idle");
  const [displayed, setDisplayed] = useState<TeamId>("A");

  const start = () => {
    const winner: TeamId = Math.random() < 0.5 ? "A" : "B";
    // Start from the opposite team — even number of cycles always lands on winner
    let current: TeamId = winner === "A" ? "B" : "A";
    setDisplayed(current);
    setPhase("spinning");

    let i = 0;
    const cycle = () => {
      current = current === "A" ? "B" : "A";
      setDisplayed(current);
      i++;
      if (i < SPIN_DELAYS_MS.length) {
        setTimeout(cycle, SPIN_DELAYS_MS[i]);
      } else {
        setPhase("settled");
        setTimeout(() => onResolved(winner), SETTLED_HOLD_MS);
      }
    };
    setTimeout(cycle, SPIN_DELAYS_MS[0]);
  };

  return { phase, displayed, start };
}

// ─── Reveal visual — redesign this without touching the logic above ──────────
function ServeReveal({
  phase,
  teamName,
}: {
  phase: "spinning" | "settled";
  teamName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-4"
    >
      <motion.span
        animate={{ opacity: phase === "settled" ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="text-xs font-semibold tracking-widest uppercase text-muted-foreground"
      >
        Saca
      </motion.span>

      <motion.span
        key={phase === "settled" ? "settled" : teamName}
        initial={
          phase === "settled" ? { scale: 0.85, opacity: 0 } : { opacity: 0 }
        }
        animate={{ scale: 1, opacity: 1 }}
        transition={
          phase === "settled"
            ? {
                duration: 0.3,
                ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
              }
            : { duration: 0.05 }
        }
        className={`text-5xl font-bold text-center px-6 leading-tight ${
          phase === "settled" ? "text-foreground" : "text-muted-foreground/40"
        }`}
      >
        {teamName}
      </motion.span>
    </motion.div>
  );
}
// ────────────────────────────────────────────────────────────────────────────

function computeDefaultServeOption(completedSets: MatchSet[]): ServeOption {
  const aCount = completedSets.filter((s) => s.initialServer === "A").length;
  const bCount = completedSets.filter((s) => s.initialServer === "B").length;
  if (aCount > bCount) return "B";
  if (bCount > aCount) return "A";
  return "random";
}

type Props = {
  currentSetIndex: number;
  match: Match;
};

export const StartSetPanel = ({ currentSetIndex, match }: Props) => {
  const startSet = useStartSet();
  const completedSets = match.sets
    .filter((s) => s.winner !== null)
    .sort((a, b) => a.index - b.index);
  const defaultOption = computeDefaultServeOption(completedSets);
  const [selected, setSelected] = useState<ServeOption>(defaultOption);
  const { phase, displayed, start } = useServeReveal(startSet);

  const handleStart = () => {
    if (selected === "random") {
      start();
    } else {
      startSet(selected);
    }
  };

  const options: { value: ServeOption; label: string }[] = [
    { value: "A", label: match.teamNames.A },
    { value: "random", label: "Aleatorio" },
    { value: "B", label: match.teamNames.B },
  ];

  return (
    <>
      <div className="flex flex-col h-screen px-6 pt-16 pb-10">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Set
          </span>
          <span className="text-9xl font-bold tabular-nums leading-none">
            {currentSetIndex + 1}
          </span>
        </div>

        {completedSets.length > 0 && (
          <div className="mt-10 bg-card border border-border rounded-xl p-4">
            <table className="w-full text-center">
              <thead>
                <tr>
                  <th className="text-left pb-3" />
                  {completedSets.map((s) => (
                    <th
                      key={s.index}
                      className="pb-3 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                    >
                      S{s.index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(["A", "B"] as TeamId[]).map((teamId) => (
                  <tr key={teamId}>
                    <td className="text-left py-1.5 text-sm font-semibold text-foreground pr-4 max-w-[130px] truncate">
                      {match.teamNames[teamId]}
                    </td>
                    {completedSets.map((s) => (
                      <td
                        key={s.index}
                        className={[
                          "px-3 py-1.5 text-base font-mono",
                          s.winner === teamId
                            ? "text-foreground font-bold"
                            : "text-muted-foreground",
                        ].join(" ")}
                      >
                        {s.score[teamId]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
          <span className="text-sm font-medium text-muted-foreground">
            ¿Quién saca primero?
          </span>
          <div className="flex w-full rounded-xl overflow-hidden border border-border gap-px bg-border">
            {options.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelected(value)}
                className={[
                  "flex-1 py-5 px-2 text-sm font-semibold transition-colors leading-tight",
                  selected === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-14 text-base rounded-xl"
          onClick={handleStart}
        >
          Iniciar Set
        </Button>
      </div>

      <AnimatePresence>
        {phase !== "idle" && (
          <ServeReveal phase={phase} teamName={match.teamNames[displayed]} />
        )}
      </AnimatePresence>
    </>
  );
};
