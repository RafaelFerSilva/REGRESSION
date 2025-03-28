import { Role, Team } from '@prisma/client'
import { TeamsRepository } from '@/repositories/interfaces/teams-repository'
import { TeamNotFoundError } from '../errors/team-not-found-error'
import { UsersRepository } from '@/repositories/interfaces/users-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { UnauthorizedError } from '../errors/unauthorizes-error'

interface UpdateDataProps {
  name?: string
  active?: boolean
}

interface UpdateTeamsUseCaseRequest {
  teamsId: string
  data: UpdateDataProps
  authenticatedUserId: string
}

interface UpdateTeamsUseCaseResponse {
  team: Team
}

export class UpdateTeamsUseCase {
  constructor(
    private teamsRepository: TeamsRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute({
    teamsId,
    data,
    authenticatedUserId,
  }: UpdateTeamsUseCaseRequest): Promise<UpdateTeamsUseCaseResponse> {
    const user = await this.userRepository.findById(authenticatedUserId)
    if (!user || user === null) throw new UserNotFoundError()
    if (user.role !== Role.ADMIN) throw new UnauthorizedError()

    const teamById = await this.teamsRepository.findById(teamsId)
    if (!teamById) throw new TeamNotFoundError()

    const updateData: Partial<Team> = {}

    if (data.name && data.name !== teamById.name) updateData.name = data.name

    if (
      typeof data.active === 'boolean' &&
      data.active !== teamById.active &&
      data.active !== undefined &&
      data.active !== null
    ) {
      updateData.active = data.active
    }

    if (Object.keys(updateData).length === 0) {
      return { team: teamById }
    }

    const updatedUser = await this.teamsRepository.update(teamsId, updateData)

    return { team: updatedUser }
  }
}
