import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { GetUserTeamsUseCase } from '../Users/get-user-teams'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeGetUserTeamsUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const usersRepository = new PrismaUsersRepository
  const getUserTeamsUseCase = new GetUserTeamsUseCase(teamsRepository, usersRepository)

  return getUserTeamsUseCase
}