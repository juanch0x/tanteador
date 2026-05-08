import { useEffect } from "react";

export const useWakeLock = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;
    if (!("wakeLock" in navigator)) return;

    let lock: WakeLockSentinel | null = null;

    const acquire = async () => {
      try {
        lock = await navigator.wakeLock.request("screen");
      } catch {
        // El browser puede rechazar el request (batería baja, etc.) — ignoramos silenciosamente
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        acquire();
      }
    };

    acquire();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      lock?.release();
    };
  }, [enabled]);
};
