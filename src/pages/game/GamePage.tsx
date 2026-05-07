import {
  useCloseSet,
  useCurrentMatch,
  useFinishMatch,
  useGetCurrentSet,
  useUpdateScore,
} from "@/store/store";
import type { MatchSet, TeamId } from "@/types/BaseTypes";
import { useNavigate } from "react-router";
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

  const isTie = currentSet.score.A === currentSet.score.B;
  const isEmptySet = currentSet.score.A === 0 && currentSet.score.B === 0;
  const hasCompletedSet = currentMatch.sets.some((s) => s.winner !== null);
  // Disabled on any tie. Special case: 0-0 only finishes when at least one
  // set was already completed — otherwise there's nothing to record.
  const canFinishMatch = !isTie || (isEmptySet && hasCompletedSet);

  const handleFinishMatch = () => {
    finishMatch();
    navigate("/");
  };

  const completedSets = currentMatch.sets
    .filter((s): s is MatchSet & { winner: TeamId } => s.winner !== null)
    .sort((a, b) => a.index - b.index);

  const handleIncrement = (teamId: TeamId) => {
    updateScore(teamId, "increment");
  };

  const renderIncrementalButton = (teamId: TeamId) => {
    const score = currentSet.score[teamId];
    const name = currentMatch.teamNames[teamId];
    return (
      <div className="flex-1 justify-between items-center flex flex-col pt-4">
        <span className="block text-xl">{name}</span>
        <span className="block text-5xl">{score}</span>
        <span className="block opacity-0">{name}</span>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="grid grid-cols-2 h-[60%]">
        <button
          className="bg-red-500 flex"
          onClick={() => handleIncrement("A")}
        >
          {renderIncrementalButton("A")}
        </button>
        <button
          className="bg-blue-500 flex"
          onClick={() => handleIncrement("B")}
        >
          {renderIncrementalButton("B")}
        </button>
      </div>

      <div className="flex flex-col items-center gap-3 pt-6 px-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isTie} variant="outline" size="lg">
              Finalizar Set
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Cerrar este set?</AlertDialogTitle>
              <AlertDialogDescription>
                El set actual se va a cerrar con el resultado vigente y va a
                empezar uno nuevo desde cero. Esta acción no se puede deshacer.
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
            <Button disabled={!canFinishMatch} variant="destructive" size="lg">
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

      {completedSets.length > 0 && (
        <div className="px-4 pt-6">
          <table className="w-full text-sm text-center border-collapse">
            <thead>
              <tr>
                <th className="text-left pb-2 pr-4" />
                {completedSets.map((s) => (
                  <th key={s.index} className="pb-2 px-2 font-medium">
                    Set {s.index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(["A", "B"] as TeamId[]).map((teamId) => (
                <tr key={teamId}>
                  <td className="text-left pr-4 py-1 font-medium">
                    {currentMatch.teamNames[teamId]}
                  </td>
                  {completedSets.map((s) => (
                    <td key={s.index} className="px-2 py-1">
                      {s.score[teamId]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
