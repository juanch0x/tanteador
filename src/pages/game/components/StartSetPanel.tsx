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
  const completedSets = match.sets.filter((s) => s.winner !== null);
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
    <div className="flex flex-col items-center justify-center h-screen gap-8 px-6">
      <h2 className="text-2xl font-semibold">Set {currentSetIndex + 1}</h2>

      {completedSets.length > 0 && (
        <table className="text-sm text-center border-collapse w-full max-w-xs">
          <thead>
            <tr>
              <th className="text-left pb-2 pr-4" />
              {completedSets
                .sort((a, b) => a.index - b.index)
                .map((s) => (
                  <th key={s.index} className="pb-2 px-2 font-medium">
                    Set {s.index + 1}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {(["A", "B"] as TeamId[]).map((teamId) => (
              <tr key={teamId}>
                <td className="text-left pr-4 py-1 font-medium truncate max-w-[120px]">
                  {match.teamNames[teamId]}
                </td>
                {completedSets
                  .sort((a, b) => a.index - b.index)
                  .map((s) => (
                    <td key={s.index} className="px-2 py-1">
                      {s.score[teamId]}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex flex-col items-center gap-4 w-full max-w-xs">
        <span className="text-base font-medium">¿Quién saca primero?</span>
        <div className="flex w-full rounded-lg overflow-hidden border border-border">
          {options.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSelected(value)}
              className={[
                "flex-1 py-3 text-sm font-medium transition-colors",
                selected === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-muted",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" onClick={handleStart}>
        Iniciar Set
      </Button>
    </div>
  );
};
