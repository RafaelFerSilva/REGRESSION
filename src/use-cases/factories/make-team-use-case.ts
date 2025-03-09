import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { GetTeamUseCase } from '../Teams/get-team'

export function makeGetTeamUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const getTeamUseCase = new GetTeamUseCase(teamsRepository)

  return getTeamUseCase
}