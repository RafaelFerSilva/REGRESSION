// @/test/factories/team-factory.ts
import { Team } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-team-repository'

interface CreateTeamParams {
  id?: string
  name?: string
  userId: string
  active?: boolean
}

export async function makeTeam(
  teamsRepository: InMemoryTeamsRepository,
  params: CreateTeamParams,
): Promise<Team> {
  const team = await teamsRepository.create({
    id: params.id || randomUUID(),
    name: params.name || `Team ${randomUUID().substring(0, 5)}`,
    userId: params.userId,
    active: params.active !== undefined ? params.active : true,
  })

  return team
}
