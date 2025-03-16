import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { UserResponse } from "@/interfaces/user-interfaces";

interface GetUsersByRoleUseCaseRequest {
  role: string,
  page?: number
}

interface GetUsersByRoleUseCaseResponse {
  users: UserResponse[]
}

export class GetUsersByRoleUseCase {
  constructor(private userRepository: UsersRepository) { }

  async execute({
    role,
    page
  }: GetUsersByRoleUseCaseRequest): Promise<GetUsersByRoleUseCaseResponse> {
    const users = await this.userRepository.findByRole(role, Number(page))

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