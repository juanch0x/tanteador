import type { Match, MatchSet, TeamId } from "@/types/BaseTypes";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const countSetsWonBy = (match: Match, teamId: TeamId): number =>
  match.sets.filter((s) => s.winner === teamId).length;

const getMatchWinner = (match: Match): TeamId | null => {
  const a = countSetsWonBy(match, "A");
  const b = countSetsWonBy(match, "B");
  if (a === b) return null;
  return a > b ? "A" : "B";
};

const buildShareText = (match: Match): string => {
  const setsA = countSetsWonBy(match, "A");
  const setsB = countSetsWonBy(match, "B");
  const closedSets = match.sets
    .filter((s): s is MatchSet & { winner: TeamId } => s.winner !== null)
    .sort((a, b) => a.index - b.index);

  const setsDetail = closedSets
    .map((s, i) => `Set ${i + 1}: ${s.score.A} - ${s.score.B}`)
    .join("\n");

  return `🏓 ${match.teamNames.A} vs ${match.teamNames.B}\nResultado: ${setsA} - ${setsB}\n\n${setsDetail}`;
};

const handleShare = async (match: Match) => {
  const text = buildShareText(match);
  if (navigator.share) {
    await navigator.share({ text });
  } else {
    await navigator.clipboard.writeText(text);
  }
};

interface Props {
  match: Match;
  value: string;
}

const MatchHistoryCard = ({ match, value }: Props) => {
  const setsA = countSetsWonBy(match, "A");
  const setsB = countSetsWonBy(match, "B");
  const winner = getMatchWinner(match);
  const relativeTime = match.finishedAt
    ? formatDistanceToNow(parseISO(match.finishedAt), {
        addSuffix: true,
        locale: es,
      })
    : null;

  const closedSets = match.sets
    .filter((s): s is MatchSet & { winner: TeamId } => s.winner !== null)
    .sort((a, b) => a.index - b.index);

  const teamClass = (teamId: TeamId) =>
    winner === teamId
      ? "text-sm font-bold text-foreground"
      : "text-sm text-muted-foreground";

  const scoreClass = (teamId: TeamId) =>
    winner === teamId
      ? "tabular-nums text-right font-bold text-foreground"
      : "tabular-nums text-right text-muted-foreground";

  return (
    <AccordionItem
      value={value}
      className="bg-card border border-border rounded-xl px-4 py-3"
    >
      <AccordionTrigger className="p-0 hover:no-underline items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 items-center">
            <span className={teamClass("A")}>{match.teamNames.A}</span>
            <span className={scoreClass("A")}>{setsA}</span>
            <span className={teamClass("B")}>{match.teamNames.B}</span>
            <span className={scoreClass("B")}>{setsB}</span>
          </div>
          {relativeTime && (
            <p className="text-xs text-muted-foreground/60 text-right pt-1">
              {relativeTime}
            </p>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="pt-3 pb-0">
        <div className="border-t border-border pt-3 mb-3 space-y-1.5">
          {closedSets.map((s, i) => (
            <div
              key={s.index}
              className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-x-2 text-sm"
            >
              <span className="text-muted-foreground text-xs w-10">
                Set {i + 1}
              </span>
              <span />
              <span
                className={
                  s.winner === "A" ? "font-bold text-foreground" : "text-muted-foreground"
                }
              >
                {s.score.A}
              </span>
              <span className="text-muted-foreground">–</span>
              <span
                className={
                  s.winner === "B" ? "font-bold text-foreground" : "text-muted-foreground"
                }
              >
                {s.score.B}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={() => handleShare(match)}>
            Compartir ↗
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default MatchHistoryCard;
