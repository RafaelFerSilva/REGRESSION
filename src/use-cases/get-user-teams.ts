import { TeamResponse } from "@/interfaces/team-interfaces";
import { TeamsRepository } from "@/repositories/interfaces/teams-repository";
import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";

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
    if(!user) throw new ResourceNotFoundError()
    const teams = await this.teamsRepository.findManyByUserIdAll(user.id, Number(page))

    const teamsResponse = teams.map((item) => {
      return {
        name: item.name,
        created_at: item.created_at,
        userId: item.userId
      }
    })

    return { 
      teams: teamsResponse
    }
  }
}