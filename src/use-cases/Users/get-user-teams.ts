import { TeamResponse } from "@/interfaces/team-interfaces";
import { TeamsRepository } from "@/repositories/interfaces/teams-repository";
import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { UserNotFoundError } from "../errors/user-not-found-error";

interface GetUserTeamsUseCaseRequest {
  userId: string
  page?: number
}

interface GetUserTeamsUseCaseResponse {
  teams: TeamResponse[]
}

export class GetUserTeamsUseCase {
  constructor(private teamsRepository: TeamsRepository, private usersRepository: UsersRepository) {}

  async execute({
    userId,
    page,
  }: GetUserTeamsUseCaseRequest): Promise<GetUserTeamsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)
    if(!user) throw new UserNotFoundError()
    const teams = await this.teamsRepository.findManyByUserId(user.id, Number(page))

    const teamsResponse = teams.map((item) => {
      const teamResponse: TeamResponse = {
        id: item.id,
        name: item.name,
        created_at: item.created_at,
        updated_at: item.updated_at,
        userId: item.userId,
        active: item.active
      }
      return teamResponse
    })

    return { 
      teams: teamsResponse
    }
  }
}