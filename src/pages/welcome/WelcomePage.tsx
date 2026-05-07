import CurrentMatch from "./components/CurrentMatch";
import NewMatch from "./components/NewMatch";
import RecentMatches from "./components/RecentMatches";
import { PageTransition } from "@/components/shared/PageTransition";
import { Footer } from "@/components/shared/Footer";

export const WelcomePage = () => {
  return (
    <PageTransition>
    <div className="min-h-screen flex flex-col px-6 pt-14 pb-10 gap-6">
      <header>
        <h1 className="text-3xl font-bold">Tanteador</h1>
        <p className="text-sm text-muted-foreground mt-1">Pelota Paleta</p>
      </header>
      <CurrentMatch />
      <NewMatch />
      <RecentMatches />
      <Footer className="mt-auto" />
    </div>
    </PageTransition>
  );
};
