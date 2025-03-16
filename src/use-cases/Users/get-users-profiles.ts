import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { UserResponse } from "@/interfaces/user-interfaces";

interface GetUsersProfilesUseCaseRequest {
  page: number
}

interface GetUsersProfilesUseCaseResponse {
  users: UserResponse[]
}

export class GetUsersProfilesUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
  }: GetUsersProfilesUseCaseRequest): Promise<GetUsersProfilesUseCaseResponse> {
    const users = await this.usersRepository.findAll(Number(page))

    const usersResponse = users.map((item) => {
      return {
        name: item.name,
        email: item.email,
        created_at: item.created_at,
        role: item.role,
        active: item.active
      }
    })

    return { 
      users: usersResponse
    }
  }
}