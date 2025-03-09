import { TeamsRepository } from "@/repositories/interfaces/teams-repository";
import { Team } from "@prisma/client";
import { UserNotFoundError } from "../errors/user-not-found-error";
import { TeamAlreadyExistError } from "../errors/team-already-exists-error";
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
    if (!user || user === null) throw new UserNotFoundError()
    
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