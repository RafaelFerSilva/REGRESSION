import { TeamResponse } from "@/interfaces/team-interfaces";
import { TeamsRepository } from "@/repositories/interfaces/teams-repository";

interface GetTeamsUseCaseRequest {
  page: number
}

interface GetTeamsUseCaseResponse {
  teams: TeamResponse[]
}

export class GetTeamsUseCase {
  constructor(private teamsRepository: TeamsRepository) {}

  async execute({
    page,
  }: GetTeamsUseCaseRequest): Promise<GetTeamsUseCaseResponse> {
    const team = await this.teamsRepository.findAll(Number(page))

    const teamsResponse = team.map((item) => {
      return {
        id: item.id,
        name: item.name,
        created_at: item.created_at,
        userId: item.userId,
        active: item.active
      }
    })

    return { 
      teams: teamsResponse
    }
  }
}