import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { CreateTeamUseCase } from '../../Teams/create-teams'

export function makeCreateTeamCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const usersRepository = new PrismaUsersRepository()
  const createTeamUseCase = new CreateTeamUseCase(teamsRepository, usersRepository)

  return createTeamUseCase
}