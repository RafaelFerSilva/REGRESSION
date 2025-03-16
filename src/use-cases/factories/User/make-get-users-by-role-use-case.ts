import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUsersByRoleUseCase } from '../../Users/get-users-by-role'

export function makeGetUsersByRolesUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const getUsersByRoleUseCase = new GetUsersByRoleUseCase(usersRepository)

  return getUsersByRoleUseCase
}