import { GamePage } from "./pages/game/GamePage";
import { NewGamePage } from "./pages/new-game/NewGamePage";
import { WelcomePage } from "./pages/welcome/WelcomePage";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/new" element={<NewGamePage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
