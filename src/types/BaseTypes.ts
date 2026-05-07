import { z } from "zod";

const TeamId = z.enum(["A", "B"]);
export type TeamId = z.infer<typeof TeamId>;

const Score = z.object({
  B: z.number().int().nonnegative().default(0),
  A: z.number().int().nonnegative().default(0),
});

const MatchSet = z.object({
  index: z.number().int().nonnegative(),
  score: Score,
  initialServer: TeamId.nullable(),
  winner: TeamId.nullable(),
  closeAt: z.string().datetime().nullable(),
});

const Match = z.object({
  teamNames: z
    .record(TeamId, z.string().min(1))
    .default({ A: "Equipo A", B: "Equipo B" }),
  sets: z.array(MatchSet).default([
    {
      index: 0,
      score: {
        A: 0,
        B: 0,
      },
      initialServer: null,
      winner: null,
      closeAt: null,
    },
  ]),
  createdAt: z.string().datetime().default(new Date().toDateString()),
  finishedAt: z.string().datetime().nullable().default(null),
});

export type Match = z.infer<typeof Match>;
export type MatchSet = z.infer<typeof MatchSet>;

export const isFinished = (m: Match) => m.finishedAt !== null;

export { TeamId, Score, MatchSet, Match };
