import { useMatchHistory } from "@/store/store";
import { PageTransition } from "@/components/shared/PageTransition";
import MatchHistoryCard from "@/components/shared/MatchHistoryCard";
import { Accordion } from "@/components/ui/accordion";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/shared/Footer";

export const HistoryPage = () => {
  const matchHistory = useMatchHistory();
  const navigate = useNavigate();

  const sorted = [...matchHistory].sort((a, b) =>
    (b.finishedAt ?? "").localeCompare(a.finishedAt ?? "")
  );

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col px-6 pt-14 pb-10 gap-6">
        <header>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-4 -ml-1"
          >
            <ArrowLeft className="size-4" />
            <span className="text-sm">Volver</span>
          </button>
          <h1 className="text-3xl font-bold">Historial</h1>
          <p className="text-sm text-muted-foreground mt-1">Pelota Paleta</p>
        </header>

        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no hay partidos registrados.
          </p>
        ) : (
          <Accordion type="single" collapsible className="flex flex-col gap-2">
            {sorted.map((match, idx) => (
              <MatchHistoryCard
                key={`${match.finishedAt ?? "unknown"}-${idx}`}
                match={match}
                value={`match-${idx}`}
              />
            ))}
          </Accordion>
        )}
        <Footer className="mt-auto" />
      </div>
    </PageTransition>
  );
};
