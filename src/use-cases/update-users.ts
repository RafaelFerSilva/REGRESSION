import { hash } from "bcryptjs";
import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { UserNotExistError } from "./errors/user-not-exists-error";
import { User } from "@prisma/client";
import { EmailAlreadyExistError } from "./errors/email-already-exists-error";
import { PasswordError } from "./errors/password-error";

interface UpdateUserUseCaseRequest {
  name?: string,
  email?: string,
  password?: string,
  rule?: string,
  active?: boolean
}

interface UpdateUser {
  name: string,
  email: string,
  password_hash: string,
  rule: string,
  active: boolean
}

interface UpdateUserUseCaseResponse {
  user: User
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute(userId: string, data: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    let updateData: UpdateUser = {
      name: "",
      email: "",
      password_hash: "",
      rule: "",
      active: true
    }

    const userById = await this.usersRepository.findById(userId)
    if (!userById) throw new UserNotExistError()

    if(data.email) {
      const userByEmail = await this.usersRepository.findbyEmail(data.email)
      if(userByEmail) {
        if(userByEmail.id !== userById.id) {
          throw new EmailAlreadyExistError()
        }
      }
      updateData.email = data.email
    }

    if (data.password) {
      if(data.password.length < 6) {
        throw new PasswordError()
      }
      updateData.password_hash = await hash(data.password, 6)
    }

    if (data.name) updateData.name = data.name
    if (data.rule) updateData.rule = data.rule
    
    if (data.active !== userById.active && data.active !== undefined) {
      updateData.active = data.active
    }

    const updatedUser = await this.usersRepository.update(userId, updateData)
    return {
      user: updatedUser,
    }
  }
}