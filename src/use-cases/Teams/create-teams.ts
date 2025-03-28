import { TeamsRepository } from '@/repositories/interfaces/teams-repository'
import { Role, Team } from '@prisma/client'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { TeamAlreadyExistError } from '../errors/team-already-exists-error'
import { UsersRepository } from '@/repositories/interfaces/users-repository'
import { UnauthorizedError } from '../errors/unauthorizes-error'

interface TeamUseCaseRequest {
  name: string
  authenticatedUserId: string
}

interface TeamUseCaseResponse {
  team: Team | null
}

export class CreateTeamUseCase {
  constructor(
    private teamsRepository: TeamsRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute({
    name,
    authenticatedUserId,
  }: TeamUseCaseRequest): Promise<TeamUseCaseResponse> {
    const user = await this.userRepository.findById(authenticatedUserId)
    if (!user || user === null) throw new UserNotFoundError()
    if (user.role !== Role.ADMIN) throw new UnauthorizedError()

    const teamWithSameName = await this.teamsRepository.findByName(name)
    if (teamWithSameName) throw new TeamAlreadyExistError()

    const team = await this.teamsRepository.create({
      name,
      userId: authenticatedUserId,
    })

    return {
      team,
    }
  }
}
