import { useEffect } from "react";

export const usePreventUnload = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handler);

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [enabled]);
};
