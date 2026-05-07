import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Match, MatchSet, TeamId } from "@/types/BaseTypes";

type Store = {
  currentMatch: Match | null;
  matchHistory: Match[];
  setCurrentMatch: (match: Match) => void;
  initMatch: (names: Pick<Match, "teamNames">) => void;
  discardCurrentMatch: () => void;
  getCurrentSet: () => MatchSet | null;
  startSet: (server: TeamId) => void;
  updateScore: (team: TeamId, mode: "increment" | "decrement") => void;
  closeSet: () => void;
  finishMatch: () => void;
  resetAll: () => void;
};

export const useTanteadorStore = create<Store>()(
  persist(
    (set, get) => ({
      currentMatch: null,
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
        set((state) => ({ ...state, currentMatch: null })),

      getCurrentSet: () => {
        const currentMatch = get().currentMatch;
        if (currentMatch?.sets == null) return null;
        return currentMatch.sets.reduce((previous: MatchSet, current: MatchSet) =>
          previous.index > current.index ? previous : current,
        );
      },

      startSet: (server) => {
        const currentSet = get().getCurrentSet();
        if (currentSet == null || currentSet.initialServer !== null) return;
        const updatedSet: MatchSet = { ...currentSet, initialServer: server };
        set((state) => ({
          ...state,
          currentMatch:
            state.currentMatch == null
              ? null
              : {
                  ...state.currentMatch,
                  sets: state.currentMatch.sets.map((e) =>
                    e.index === updatedSet.index ? updatedSet : e,
                  ),
                },
        }));
      },

      updateScore: (teamId, mode) => {
        const currentSet = get().getCurrentSet();
        if (currentSet == null) return;
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

      resetAll: () => {
        set({ currentMatch: null, matchHistory: [] });
        useTanteadorStore.persist.clearStorage();
      },

      finishMatch: () => {
        const currentMatch = get().currentMatch;
        if (currentMatch == null) return;

        const currentSet = get().getCurrentSet();
        if (currentSet == null) return;

        const { A, B } = currentSet.score;
        const isTie = A === B;
        const isEmpty = A === 0 && B === 0;

        if (isTie && !isEmpty) return;

        const hasCompletedSet = currentMatch.sets.some((s) => s.winner !== null);
        if (isEmpty && !hasCompletedSet) return;

        let finalSets: MatchSet[];
        if (isEmpty) {
          finalSets = currentMatch.sets.filter((s) => s.index !== currentSet.index);
        } else {
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
    }),
    { name: "tanteador-store" },
  ),
);

export const useCurrentMatch = () => useTanteadorStore((x) => x.currentMatch);
export const useIsMatchInProgress = () =>
  useTanteadorStore((x) => x.currentMatch != null);
export const useDiscardCurrentMatch = () =>
  useTanteadorStore((x) => x.discardCurrentMatch);
export const useInitializeMatch = () => useTanteadorStore((x) => x.initMatch);

export const useGetCurrentSet = () =>
  useTanteadorStore((x) => x.getCurrentSet());

export const useStartSet = () => useTanteadorStore((x) => x.startSet);
export const useUpdateScore = () => useTanteadorStore((x) => x.updateScore);
export const useCloseSet = () => useTanteadorStore((x) => x.closeSet);
export const useFinishMatch = () => useTanteadorStore((x) => x.finishMatch);
export const useMatchHistory = () => useTanteadorStore((x) => x.matchHistory);
export const useResetAll = () => useTanteadorStore((x) => x.resetAll);
