import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUsersProfilesUseCase } from '../../Users/get-users-profiles'

export function makeGetUsersProfilesUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const getUsersProfilesUseCase = new GetUsersProfilesUseCase(usersRepository)

  return getUsersProfilesUseCase
}