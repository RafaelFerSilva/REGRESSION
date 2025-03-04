import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { UserResponse } from "@/interfaces/user-interfaces";

interface GetUsersByRuleUseCaseRequest {
  rule: string,
  page?: number
}

interface GetUsersByRuleUseCaseResponse {
  users: UserResponse[]
}

export class GetUsersByRuleUseCase {
  constructor(private userRepository: UsersRepository) { }

  async execute({
    rule,
    page
  }: GetUsersByRuleUseCaseRequest): Promise<GetUsersByRuleUseCaseResponse> {
    const users = await this.userRepository.findByRule(rule, Number(page))

    const usersResponse = users.map((item) => {
      return {
        name: item.name,
        email: item.email,
        created_at: item.created_at,
        rule: item.rule,
        active: item.active
      }
    })

    return {
      users: usersResponse
    }
  }
}