import { TeamsRepository } from "@/repositories/teams.repository";
import { Team } from "@prisma/client";
import { UserNotExistError } from "./erros/user-not-exists-error";
import { TeamAlreadyExistError } from "./erros/team-already-exists-error";
import { RegisterUseCase } from "./register";
import { UsersRepository } from "@/repositories/users.repository";


interface TeamUseCaseRequest {
  name: string,
  userId: string
}

interface TeamUseCaseResponse {
  team: Team
}

export class CreateTeamUseCase {
  constructor(private teamsRepository: TeamsRepository, private userRepository: UsersRepository) { }

  async execute({ name, userId }: TeamUseCaseRequest): Promise<TeamUseCaseResponse> {
    const user = await this.userRepository.findById(userId)
    const teamWithSameName = await this.teamsRepository.findByName(name)

    if (!user) throw new UserNotExistError()
    if (teamWithSameName) throw new TeamAlreadyExistError()

    return {
      team: null
    }
  }
}