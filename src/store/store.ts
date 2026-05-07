import { create } from "zustand";
import { Match, MatchSet, TeamId } from "@/types/BaseTypes";

type Store = {
  currentMatch: Match | null;
  matchHistory: Match[];
  setCurrentMatch: (match: Match) => void;
  initMatch: (names: Pick<Match, "teamNames">) => void;
  discardCurrentMatch: () => void;
  //set
  getCurrentSet: () => MatchSet | null;
  updateScore: (team: TeamId, mode: "increment" | "decrement") => void;
  closeSet: () => void;
  finishMatch: () => void;
};

const createStore = create<Store>();

export const useTanteadorStore = createStore((set, get) => ({
  currentMatch: {
    createdAt: "2026-03-15",
    finishedAt: null,
    sets: [
      {
        index: 0,
        initialServer: "A",
        score: {
          A: 11,
          B: 2,
        },
        winner: null,
        closeAt: null,
      },
    ],
    teamNames: {
      A: "Juan Portugal - Martín Guerra",
      B: "Pedro Alvarez - Joaquin Pedregal",
    },
  },
  matchHistory: [],
  initMatch: (names) => {
    const initializedPayload = Match.parse(names);
    console.info("initializedPayload", { names, initializedPayload });
    set((state) => ({ ...state, currentMatch: initializedPayload }));
  },
  setCurrentMatch: (match) => {
    set((state) => ({ ...state, currentMatch: match }));
  },
  discardCurrentMatch: () =>
    set((state) => ({
      ...state,
      currentMatch: null,
    })),
  getCurrentSet: () => {
    const currentMatch = get().currentMatch;
    if (currentMatch?.sets == null) {
      return null;
    }
    return currentMatch.sets.reduce((previous: MatchSet, current: MatchSet) =>
      previous.index > current.index ? previous : current,
    );
  },
  updateScore: (teamId, mode) => {
    const currentSet = get().getCurrentSet();
    if (currentSet == null) {
      return;
    }
    const previousScore = currentSet.score[teamId];
    const newScore =
      mode === "increment" ? previousScore + 1 : previousScore - 1;
    const newSet = {
      ...currentSet,
      score: { ...currentSet.score, [teamId]: newScore },
    };
    set((state) => ({
      ...state,
      currentMatch:
        state.currentMatch == null
          ? null
          : {
              ...state.currentMatch,
              sets: state.currentMatch.sets.map((e) =>
                e.index === newSet.index ? newSet : e,
              ),
            },
    }));
  },
  closeSet: () => {
    const currentSet = get().getCurrentSet();
    if (currentSet == null) return;
    const { A, B } = currentSet.score;
    if (A === B) return;
    const winner: TeamId = A > B ? "A" : "B";
    const closedSet: MatchSet = {
      ...currentSet,
      winner,
      closeAt: new Date().toISOString(),
    };
    const newSet: MatchSet = {
      index: currentSet.index + 1,
      score: { A: 0, B: 0 },
      initialServer: null,
      winner: null,
      closeAt: null,
    };
    set((state) => ({
      ...state,
      currentMatch:
        state.currentMatch == null
          ? null
          : {
              ...state.currentMatch,
              sets: [
                ...state.currentMatch.sets.map((e) =>
                  e.index === closedSet.index ? closedSet : e,
                ),
                newSet,
              ],
            },
    }));
  },
  finishMatch: () => {
    const currentMatch = get().currentMatch;
    if (currentMatch == null) return;

    const currentSet = get().getCurrentSet();
    if (currentSet == null) return;

    const { A, B } = currentSet.score;
    const isTie = A === B;
    const isEmpty = A === 0 && B === 0;

    // The UI disables the action on any tie. Defend at the store level too:
    // the only acceptable tie is 0-0, which we discard. Any other tie is invalid.
    if (isTie && !isEmpty) return;

    const hasCompletedSet = currentMatch.sets.some((s) => s.winner !== null);

    // 0-0 only makes sense to finish if at least one set was actually played.
    if (isEmpty && !hasCompletedSet) return;

    let finalSets: MatchSet[];
    if (isEmpty) {
      // Drop the empty current set; keep only what was actually played.
      finalSets = currentMatch.sets.filter((s) => s.index !== currentSet.index);
    } else {
      // Close the current set with its existing score.
      const winner: TeamId = A > B ? "A" : "B";
      finalSets = currentMatch.sets.map((s) =>
        s.index === currentSet.index
          ? { ...s, winner, closeAt: new Date().toISOString() }
          : s,
      );
    }

    const finishedMatch: Match = {
      ...currentMatch,
      sets: finalSets,
      finishedAt: new Date().toISOString(),
    };

    set((state) => ({
      ...state,
      currentMatch: null,
      matchHistory: [...state.matchHistory, finishedMatch],
    }));
  },
}));

export const useCurrentMatch = () => useTanteadorStore((x) => x.currentMatch);
export const useIsMatchInProgress = () =>
  useTanteadorStore((x) => x.currentMatch != null);
export const useDiscardCurrentMatch = () =>
  useTanteadorStore((x) => x.discardCurrentMatch);
export const useInitializeMatch = () => useTanteadorStore((x) => x.initMatch);

export const useGetCurrentSet = () =>
  useTanteadorStore((x) => x.getCurrentSet());

export const useUpdateScore = () => useTanteadorStore((x) => x.updateScore);
export const useCloseSet = () => useTanteadorStore((x) => x.closeSet);
export const useFinishMatch = () => useTanteadorStore((x) => x.finishMatch);
export const useMatchHistory = () => useTanteadorStore((x) => x.matchHistory);
