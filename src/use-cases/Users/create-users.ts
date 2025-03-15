import { hash } from "bcryptjs";
import { UserAlreadyExistError } from "../errors/user-already-exists-error";
import { User } from "@prisma/client";
import { UsersRepository } from "@/repositories/interfaces/users-repository";

interface CreateUserUseCaseRequest {
  name: string,
  email: string,
  password: string,
  rule?: string,
  active?: boolean
}

interface CreateUserUseCaseResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ name, email, password, rule, active}: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const password_hash = await hash(password, 6)
    const userWithSameEmail = await this.usersRepository.findbyEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      rule,
      active
    })

    return {
      user,
    }
  }
}