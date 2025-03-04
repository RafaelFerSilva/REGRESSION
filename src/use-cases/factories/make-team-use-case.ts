import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'
import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { GetTeamUseCase } from '../get-team'

export function makeTeamUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const getTeamUseCase = new GetTeamUseCase(teamsRepository)

  return getTeamUseCase
}