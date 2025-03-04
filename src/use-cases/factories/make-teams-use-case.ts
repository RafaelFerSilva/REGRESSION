import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { GetTeamsUseCase } from '../get-teams'

export function makeGetTeamsUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const getTeamsUseCase = new GetTeamsUseCase(teamsRepository)

  return getTeamsUseCase
}