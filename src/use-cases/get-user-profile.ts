import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { UserResponse } from "@/interfaces/user-interfaces";
import { UserNotExistError } from "./errors/user-not-exists-error";

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: UserResponse
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId)
    if(!user) throw new UserNotExistError()

    const userResponse = {
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      rule: user.rule,
      active: user.active
    }

    return { 
      user: userResponse
    }
  }
}