import { Button } from "@/components/ui/button";
import { useIsMatchInProgress } from "@/store/store";
import { Link, useNavigate } from "react-router";

const NewMatch = () => {
  const isMatchInProgress = useIsMatchInProgress();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/new");
  };
  return (
    <div className="flex justify-center items-center">
      <Button onClick={handleClick} disabled={isMatchInProgress}>
        Nuevo Partido
      </Button>
    </div>
  );
};

export default NewMatch;
