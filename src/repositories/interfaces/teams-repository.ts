import { Prisma, Team } from '@prisma/client'

export interface TeamsRepository {
  create(data: Prisma.TeamUncheckedCreateInput): Promise<Team>
  findById(id: string): Promise<Team | null>
  findByName(name: string): Promise<Team | null>
  findAll(page: number): Promise<Team[] | []>
  findManyByUserId(userId: string, page?: number): Promise<Team[] | []>
  update(
    teamId: string,
    data: Partial<Prisma.TeamUncheckedCreateInput>,
  ): Promise<Team>
}
