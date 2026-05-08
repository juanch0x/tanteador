import { useEffect, useState } from "react";

export const useNavigationBlocker = (enabled: boolean) => {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Agrega una entrada extra al historial para interceptar el back
    window.history.pushState(null, "", window.location.pathname);

    const handler = () => {
      // Vuelve a pushear para que el usuario no navegue sin confirmación
      window.history.pushState(null, "", window.location.pathname);
      setBlocked(true);
    };

    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [enabled]);

  return {
    state: blocked ? ("blocked" as const) : ("unblocked" as const),
    proceed: () => setBlocked(false),
    reset: () => setBlocked(false),
  };
};
