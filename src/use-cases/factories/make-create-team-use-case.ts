import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateUserUseCase } from '../create-users'
import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { CreateTeamUseCase } from '../create-teams'

export function makeCreateTeamCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const usersRepository = new PrismaUsersRepository()
  const createTeamUseCase = new CreateTeamUseCase(teamsRepository, usersRepository)

  return createTeamUseCase
}