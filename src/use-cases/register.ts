import { hash } from "bcryptjs";
import { UserAlreadyExistError } from "./erros/user-already-exists-error";
import { User } from "@prisma/client";

interface RegisterUseCaseRequest {
  name: string,
  email: string,
  password: string,
  rule: string,
  active: boolean
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: any) { }

  async execute({ name, email, password, rule, active = true }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
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