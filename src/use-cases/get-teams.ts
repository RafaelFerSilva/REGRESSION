import { ResourceNotFoundError } from "./erros/resource-not-found-error";
import { TeamResponse } from "@/interfaces/team.interfaces";
import { TeamsRepository } from "@/repositories/teams.repository";

interface GetTeamUseCaseRequest {
  teamId: string
}

interface GetTeamUseCaseResponse {
  team: TeamResponse
}

export class GetTeamUseCase {
  constructor(private teamsRepository: TeamsRepository) {}

  async execute({
    teamId,
  }: GetTeamUseCaseRequest): Promise<GetTeamUseCaseResponse> {
    const team = await this.teamsRepository.findById(teamId)
    if(!team) throw new ResourceNotFoundError()

    const teamResponse = {
      name: team.name,
      created_at: team.created_at,
    }

    return { 
      team: teamResponse
    }
  }
}