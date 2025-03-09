import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-team-repository'
import { UpdateUserUseCase } from '@/use-cases/update-users'
import { UpdateTeamsUseCase } from '@/use-cases/update-teams'
import { CreateUserUseCase } from '../create-users'
import { CreateTeamUseCase } from '../create-teams'
import { GetTeamUseCase } from '../get-team'

export function setupUserRepositoryAndUseCase() {
  const usersRepository = new InMemoryUsersRepository()
  const updateUserUseCase = new UpdateUserUseCase(usersRepository)
  const createUserUseCase = new CreateUserUseCase(usersRepository)
  
  return {
    usersRepository,
    updateUserUseCase,
    createUserUseCase
  }
}

export function setupTeamRepositoryAndUseCase() {
  const teamsRepository = new InMemoryTeamsRepository()
  const usersRepository = new InMemoryUsersRepository()
  const updateTeamsUseCase = new UpdateTeamsUseCase(teamsRepository)
  const createTeamsUseCase = new CreateTeamUseCase(teamsRepository, usersRepository)
  const getTeamUseCase = new GetTeamUseCase(teamsRepository)
  
  return {
    teamsRepository,
    updateTeamsUseCase,
    createTeamsUseCase,
    usersRepository,
    getTeamUseCase
  }
}