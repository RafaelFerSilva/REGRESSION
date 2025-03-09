import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { UserResponse } from "@/interfaces/user-interfaces";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { User } from "@prisma/client";

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId)
    if(!user) throw new UserNotFoundError()

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      rule: user.rule,
      active: user.active,
      password_hash: user.password_hash,
    }

    return { 
      user: userResponse
    }
  }
}