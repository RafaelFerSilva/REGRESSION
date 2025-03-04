import { TeamResponse } from "@/interfaces/team-interfaces";
import { TeamsRepository } from "@/repositories/interfaces/teams-repository";
import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { UserNotExistError } from "./errors/user-not-exists-error";

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
    if(!user) throw new UserNotExistError()
    const teams = await this.teamsRepository.findManyByUserId(user.id, Number(page))

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