import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStartSet } from "@/store/store";
import type { Match, MatchSet, TeamId } from "@/types/BaseTypes";

type ServeOption = TeamId | "random";

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

  const handleStart = () => {
    const server: TeamId =
      selected === "random"
        ? Math.random() < 0.5
          ? "A"
          : "B"
        : selected;
    startSet(server);
  };

  const options: { value: ServeOption; label: string }[] = [
    { value: "A", label: match.teamNames.A },
    { value: "random", label: "Aleatorio" },
    { value: "B", label: match.teamNames.B },
  ];

  return (
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
  );
};
