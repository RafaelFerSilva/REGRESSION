import { TeamResponse } from "@/interfaces/team-interfaces";
import { TeamsRepository } from "@/repositories/interfaces/teams-repository";
import { TeamNotFoundError } from "./errors/team-not-found-error";

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
    if(!team) throw new TeamNotFoundError()

    const teamResponse = {
      id: team.id,
      name: team.name,
      created_at: team.created_at,
      userId: team.userId,
      active: team.active,
    }

    return { 
      team: teamResponse
    }
  }
}