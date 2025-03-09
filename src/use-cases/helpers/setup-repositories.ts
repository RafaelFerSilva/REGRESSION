import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-team-repository'
import { UpdateUserUseCase } from '@/use-cases/Users/update-users'
import { UpdateTeamsUseCase } from '@/use-cases/Teams/update-teams'
import { CreateUserUseCase } from '../Users/create-users'
import { CreateTeamUseCase } from '../Teams/create-teams'
import { GetTeamUseCase } from '../Teams/get-team'
import { GetTeamsUseCase } from '../Teams/get-teams'
import { GetUserProfileUseCase } from '../Users/get-user-profile'
import { GetUserTeamsUseCase } from '../Users/get-user-teams'
import { GetUsersByRuleUseCase } from '../Users/get-users-by-rule'
import { GetUsersProfilesUseCase } from '../Users/get-users-profiles'

export function setupUserRepositoryAndUseCase() {
  const usersRepository = new InMemoryUsersRepository()
  const updateUserUseCase = new UpdateUserUseCase(usersRepository)
  const createUserUseCase = new CreateUserUseCase(usersRepository)
  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  const getUserByRuleUseCase = new GetUsersByRuleUseCase(usersRepository)
  const getUsersProfilesUseCase = new GetUsersProfilesUseCase(usersRepository)
  
  return {
    usersRepository,
    updateUserUseCase,
    createUserUseCase,
    getUserProfileUseCase,
    getUserByRuleUseCase,
    getUsersProfilesUseCase
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