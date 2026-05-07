import { useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import { DirectionContext } from "@/components/shared/PageTransition";
import { GamePage } from "./pages/game/GamePage";
import { NewGamePage } from "./pages/new-game/NewGamePage";
import { WelcomePage } from "./pages/welcome/WelcomePage";
import { HistoryPage } from "./pages/history/HistoryPage";
import { SettingsPage } from "./pages/settings/SettingsPage";

const routeOrder: Record<string, number> = {
  "/": 0,
  "/new": 1,
  "/history": 1,
  "/settings": 1,
  "/game": 2,
};

function AppRoutes() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const dirRef = useRef(1);

  if (prevPathRef.current !== location.pathname) {
    const prev = routeOrder[prevPathRef.current] ?? 0;
    const curr = routeOrder[location.pathname] ?? 0;
    dirRef.current = curr >= prev ? 1 : -1;
    prevPathRef.current = location.pathname;
  }

  return (
    <DirectionContext.Provider value={dirRef.current}>
      <div className="overflow-x-hidden">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/new" element={<NewGamePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/game" element={<GamePage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </DirectionContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
