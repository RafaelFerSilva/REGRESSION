import { Prisma, Team } from "@prisma/client";

export interface TeamsRepository {
  create(data: Prisma.TeamCreateInput): Promise<Team>
}