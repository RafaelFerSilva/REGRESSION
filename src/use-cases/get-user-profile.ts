import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { UserResponse } from "@/interfaces/user-interfaces";
import { UserNotFoundError } from "./errors/user-not-found-error";

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
    if(!user) throw new UserNotFoundError()

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