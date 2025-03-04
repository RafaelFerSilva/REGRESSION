import { Prisma, Team } from "@prisma/client";

export interface TeamsRepository {
  create(data: Prisma.TeamUncheckedCreateInput): Promise<Team>
  findById(id: string): Promise<Team | null>
  findByName(name: string): Promise<Team | null>
  findAll(page: number): Promise<Team[] | []>
  findManyByUserIdAll(userId: string, page?: number): Promise<Team[] | []>
}