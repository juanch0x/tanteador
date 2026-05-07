import { useMatchHistory } from "@/store/store";
import { Accordion } from "@/components/ui/accordion";
import MatchHistoryCard from "@/components/shared/MatchHistoryCard";

const MAX_RECENT = 5;

const RecentMatches = () => {
  const matchHistory = useMatchHistory();

  if (matchHistory.length === 0) return null;

  const recent = [...matchHistory]
    .sort((a, b) => (b.finishedAt ?? "").localeCompare(a.finishedAt ?? ""))
    .slice(0, MAX_RECENT);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
        Últimos partidos
      </p>
      <Accordion type="single" collapsible className="flex flex-col gap-2">
        {recent.map((match, idx) => (
          <MatchHistoryCard
            key={`${match.finishedAt ?? "unknown"}-${idx}`}
            match={match}
            value={`match-${idx}`}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default RecentMatches;
