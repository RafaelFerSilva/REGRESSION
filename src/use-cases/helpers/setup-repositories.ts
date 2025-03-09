import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-team-repository'
import { UpdateUserUseCase } from '@/use-cases/update-users'
import { UpdateTeamsUseCase } from '@/use-cases/update-teams'
import { CreateUserUseCase } from '../create-users'
import { CreateTeamUseCase } from '../create-teams'
import { GetTeamUseCase } from '../get-team'
import { GetTeamsUseCase } from '../get-teams'
import { GetUserProfileUseCase } from '../get-user-profile'
import { GetUserTeamsUseCase } from '../get-user-teams'
import { GetUsersByRuleUseCase } from '../get-users-by-rule'

export function setupUserRepositoryAndUseCase() {
  const usersRepository = new InMemoryUsersRepository()
  const updateUserUseCase = new UpdateUserUseCase(usersRepository)
  const createUserUseCase = new CreateUserUseCase(usersRepository)
  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  const getUserByRuleUseCase = new GetUsersByRuleUseCase(usersRepository)
  
  return {
    usersRepository,
    updateUserUseCase,
    createUserUseCase,
    getUserProfileUseCase,
    getUserByRuleUseCase
  }
}

export function setupTeamRepositoryAndUseCase() {
  const teamsRepository = new InMemoryTeamsRepository()
  const usersRepository = new InMemoryUsersRepository()
  const updateTeamsUseCase = new UpdateTeamsUseCase(teamsRepository)
  const createTeamsUseCase = new CreateTeamUseCase(teamsRepository, usersRepository)
  const getTeamUseCase = new GetTeamUseCase(teamsRepository)
  const getTeamsUseCase = new GetTeamsUseCase(teamsRepository)
  const getUserTeamsUseCase = new GetUserTeamsUseCase(teamsRepository, usersRepository)
  
  return {
    teamsRepository,
    updateTeamsUseCase,
    createTeamsUseCase,
    usersRepository,
    getTeamUseCase,
    getTeamsUseCase,
    getUserTeamsUseCase
  }
}