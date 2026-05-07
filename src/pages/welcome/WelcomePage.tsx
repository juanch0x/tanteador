import CurrentMatch from "./components/CurrentMatch";
import NewMatch from "./components/NewMatch";
import RecentMatches from "./components/RecentMatches";

export const WelcomePage = () => {
  return (
    <div className="h-screen">
      <header className="py-5 px-2">
        <h1 className="text-2xl">Tanteador Pelota Paleta</h1>
      </header>
      <CurrentMatch />
      <NewMatch />
      <RecentMatches />
    </div>
  );
};
