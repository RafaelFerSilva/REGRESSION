import { PrismaTeamsRepository } from '@/repositories/prisma/prisma-teams-repository'
import { UpdateTeamsUseCase } from '../../Teams/update-teams'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeUpdateTeamUseCase() {
  const teamsRepository = new PrismaTeamsRepository()
  const userRepository = new PrismaUsersRepository()
  const updateTeamsUseCase = new UpdateTeamsUseCase(
    teamsRepository,
    userRepository,
  )

  return updateTeamsUseCase
}
