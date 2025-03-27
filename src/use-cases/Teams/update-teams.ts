import { Team } from '@prisma/client'
import { TeamsRepository } from '@/repositories/interfaces/teams-repository'
import { TeamNotFoundError } from '../errors/team-not-found-error'

interface UpdateTeamsUseCaseRequest {
  name?: string
  active?: boolean
}

interface UpdateTeamsUseCaseResponse {
  team: Team
}

export class UpdateTeamsUseCase {
  constructor(private teamsRepository: TeamsRepository) {}

  async execute(
    teamsId: string,
    data: UpdateTeamsUseCaseRequest,
  ): Promise<UpdateTeamsUseCaseResponse> {
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
