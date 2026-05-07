import { Button } from "@/components/ui/button";
import { useIsMatchInProgress } from "@/store/store";
import { useNavigate } from "react-router";

const NewMatch = () => {
  const isMatchInProgress = useIsMatchInProgress();
  const navigate = useNavigate();

  if (isMatchInProgress) return null;

  return (
    <Button
      size="lg"
      className="w-full h-14 text-base rounded-xl"
      onClick={() => navigate("/new")}
    >
      Nuevo Partido
    </Button>
  );
};

export default NewMatch;
