import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUsersByRuleUseCase } from '../Users/get-users-by-rule'

export function makeGetUsersByRulesUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const getUsersByRuleUseCase = new GetUsersByRuleUseCase(usersRepository)

  return getUsersByRuleUseCase
}