import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { UpdateTeamsUseCase } from '../update-teams'

export function makeUpdateTeamUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const updateTeamsUseCase = new UpdateTeamsUseCase(teamsRepository)

  return updateTeamsUseCase
}