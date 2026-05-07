import {
  useCloseSet,
  useCurrentMatch,
  useFinishMatch,
  useGetCurrentSet,
  useUpdateScore,
} from "@/store/store";
import type { MatchSet, TeamId } from "@/types/BaseTypes";
import { useNavigate } from "react-router";
import { StartSetPanel } from "@/pages/game/components/StartSetPanel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CircleDot } from "lucide-react";

const teamStyle = {
  A: {
    bg: "bg-red-950",
    name: "text-red-300/60",
    badge: "bg-red-900/60 text-red-200",
  },
  B: {
    bg: "bg-blue-950",
    name: "text-blue-300/60",
    badge: "bg-blue-900/60 text-blue-200",
  },
} as const;

export const GamePage = () => {
  const currentSet = useGetCurrentSet();
  const currentMatch = useCurrentMatch()!;
  const updateScore = useUpdateScore();
  const closeSet = useCloseSet();
  const finishMatch = useFinishMatch();
  const navigate = useNavigate();

  if (currentSet == null) {
    navigate("/");
    return null;
  }

  if (currentSet.initialServer === null) {
    return (
      <StartSetPanel
        currentSetIndex={currentSet.index}
        match={currentMatch}
      />
    );
  }

  const isTie = currentSet.score.A === currentSet.score.B;
  const isEmptySet = currentSet.score.A === 0 && currentSet.score.B === 0;
  const hasCompletedSet = currentMatch.sets.some((s) => s.winner !== null);
  const canFinishMatch = !isTie || (isEmptySet && hasCompletedSet);

  const handleFinishMatch = () => {
    finishMatch();
    navigate("/");
  };

  const completedSets = currentMatch.sets
    .filter((s): s is MatchSet & { winner: TeamId } => s.winner !== null)
    .sort((a, b) => a.index - b.index);

  return (
    <div className="h-screen flex flex-col">
      <div className="grid grid-cols-2 flex-1">
        {(["A", "B"] as TeamId[]).map((teamId) => {
          const style = teamStyle[teamId];
          const score = currentSet.score[teamId];
          const name = currentMatch.teamNames[teamId];
          const isServer = currentSet.initialServer === teamId;

          return (
            <button
              key={teamId}
              onClick={() => updateScore(teamId, "increment")}
              className={`${style.bg} relative flex flex-col items-center justify-center active:brightness-125 transition-[filter] duration-75 px-4`}
            >
              <div className={`absolute top-8 flex justify-center items-center w-full px-4 ${style.name}`}>
                <span className="relative text-xs font-semibold tracking-widest uppercase text-center leading-tight">
                  {isServer && (
                    <CircleDot className="absolute -left-5 top-0 size-3.5" />
                  )}
                  {name}
                </span>
              </div>
              <span className="text-8xl font-bold tabular-nums text-white leading-none">
                {score}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 px-4 py-4 bg-background border-t border-border">
        {completedSets.length > 0 && (
          <div className="bg-card rounded-lg border border-border px-3 py-2">
            <table className="w-full text-xs text-center">
              <thead>
                <tr>
                  <th className="text-left pb-1.5 text-muted-foreground font-medium" />
                  {completedSets.map((s) => (
                    <th
                      key={s.index}
                      className="pb-1.5 px-2 text-muted-foreground font-medium"
                    >
                      S{s.index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(["A", "B"] as TeamId[]).map((teamId) => (
                  <tr key={teamId}>
                    <td className="text-left py-1 text-foreground font-semibold pr-3 max-w-[100px] truncate">
                      {currentMatch.teamNames[teamId]}
                    </td>
                    {completedSets.map((s) => (
                      <td
                        key={s.index}
                        className={[
                          "px-2 py-1 font-mono",
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

        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isTie}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Finalizar Set
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cerrar este set?</AlertDialogTitle>
                <AlertDialogDescription>
                  El set actual se va a cerrar con el resultado vigente y va a
                  empezar uno nuevo desde cero. Esta acción no se puede
                  deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={closeSet}>
                  Sí, cerrar set
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={!canFinishMatch}
                variant="destructive"
                size="lg"
                className="flex-1"
              >
                Terminar partido
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Terminar el partido?</AlertDialogTitle>
                <AlertDialogDescription>
                  {isEmptySet
                    ? "El partido se va a cerrar con los sets ya jugados. Esta acción no se puede deshacer."
                    : "El set actual se va a cerrar con el resultado vigente y el partido va a finalizar. Esta acción no se puede deshacer."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleFinishMatch}>
                  Sí, terminar partido
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
