import { Button } from "@/components/ui/button";
import { useCurrentMatch } from "@/store/store";
import DiscardMatchDialog from "./DiscardMatchDialog";
import { useNavigate } from "react-router";

const CurrentMatch = () => {
  const currentMatch = useCurrentMatch();
  const navigate = useNavigate();
  if (currentMatch == null) {
    return null;
  }

  const currentSet = currentMatch.sets.at(-1);

  const renderTeam = (name: string) => {
    return (
      <div className="text-center">
        <span className="block text-lg font-medium">{name}</span>
      </div>
    );
  };

  const renderScore = (score: number | undefined) => {
    return (
      <div className="text-center">
        <span className="block text-xl font-semibold">{score || 0}</span>
      </div>
    );
  };

  const handleContinueClick = () => {
    navigate("/game");
  };

  return (
    <div className="p-2">
      <div className="bg-gray-300 px-3 py-2 rounded">
        <h2>Partido en curso</h2>
        <hr className="border-gray-400 m-2" />
        <div className="grid grid-cols-[1fr_1px_1fr] gap-1">
          {renderTeam(currentMatch.teamNames.A)}
          <div className="w-px bg-gray-400 row-span-2" />
          {renderTeam(currentMatch.teamNames.B)}
          {renderScore(currentSet?.score?.A)}
          {renderScore(currentSet?.score?.B)}
        </div>
        <div className="flex justify-center items-center pt-5 gap-3">
          <Button onClick={handleContinueClick}>Continuar</Button>
          <DiscardMatchDialog />
        </div>
      </div>
    </div>
  );
};

export default CurrentMatch;
