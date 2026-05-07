import { Button } from "@/components/ui/button";
import { useCurrentMatch } from "@/store/store";
import DiscardMatchDialog from "./DiscardMatchDialog";
import { useNavigate } from "react-router";

const CurrentMatch = () => {
  const currentMatch = useCurrentMatch();
  const navigate = useNavigate();

  if (currentMatch == null) return null;

  const currentSet = currentMatch.sets.at(-1);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
        Partido en curso
      </p>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-5">
        <div className="text-center min-w-0">
          <p className="text-xs text-muted-foreground truncate mb-1">
            {currentMatch.teamNames.A}
          </p>
          <p className="text-4xl font-bold tabular-nums">
            {currentSet?.score?.A ?? 0}
          </p>
        </div>
        <span className="text-muted-foreground text-xl font-light">–</span>
        <div className="text-center min-w-0">
          <p className="text-xs text-muted-foreground truncate mb-1">
            {currentMatch.teamNames.B}
          </p>
          <p className="text-4xl font-bold tabular-nums">
            {currentSet?.score?.B ?? 0}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="lg"
          className="flex-1 rounded-lg"
          onClick={() => navigate("/game")}
        >
          Continuar
        </Button>
        <DiscardMatchDialog />
      </div>
    </div>
  );
};

export default CurrentMatch;
