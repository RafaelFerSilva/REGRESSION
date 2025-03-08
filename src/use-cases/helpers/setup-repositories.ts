import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { InMemoryTeamsRepository } from '@/repositories/in-memory/in-memory-team-repository'
import { UpdateUserUseCase } from '@/use-cases/update-users'
import { UpdateTeamsUseCase } from '@/use-cases/update-teams'
import { CreateUserUseCase } from '../create-users'

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
  const updateTeamsUseCase = new UpdateTeamsUseCase(teamsRepository)
  
  return {
    teamsRepository,
    updateTeamsUseCase,
  }
}