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
    <div className="p-2">
      <div className="bg-gray-300 px-3 py-2 rounded">
        <h2>Últimos partidos</h2>
        <hr className="border-gray-400 m-2" />
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
    </div>
  );
};

export default RecentMatches;
