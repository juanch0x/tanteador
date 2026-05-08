import { useBlocker } from "react-router";

export const useNavigationBlocker = (enabled: boolean) => {
  return useBlocker(enabled);
};
