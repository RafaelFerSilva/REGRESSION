import { TeamsRepository } from "@/repositories/interfaces/teams-repository";
import { Team } from "@prisma/client";
import { UserNotExistError } from "./erros/user-not-exists-error";
import { TeamAlreadyExistError } from "./erros/team-already-exists-error";
import { UsersRepository } from "@/repositories/interfaces/users-repository";


interface TeamUseCaseRequest {
  name: string,
  userId: string
}

interface TeamUseCaseResponse {
  team: Team | null
}

export class CreateTeamUseCase {
  constructor(private teamsRepository: TeamsRepository, private userRepository: UsersRepository) { }

  async execute({ name, userId }: TeamUseCaseRequest): Promise<TeamUseCaseResponse> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new UserNotExistError()
    
    const teamWithSameName = await this.teamsRepository.findByName(name)
    if (teamWithSameName) throw new TeamAlreadyExistError()

    const team = await this.teamsRepository.create({
      name: name,
      userId: userId
    })

    return {
      team
    }
  }
}