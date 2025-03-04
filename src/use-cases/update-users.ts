import { hash } from "bcryptjs";
import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { UserNotExistError } from "./errors/user-not-exists-error";
import { User } from "@prisma/client";
import { EmailAlreadyExistError } from "./errors/email-already-exists-error";

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
    let password_hash: string
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
    }

    if (data.password) {
      password_hash = await hash(data.password, 6)
      updateData.password_hash = password_hash
    }

    if (data.name) updateData.name = data.name
    if (data.email) updateData.email = data.email
    if (data.rule) updateData.rule = data.rule
    if (data.active) updateData.active = data.active

    const updatedUser = await this.usersRepository.update(userId, updateData)

    return {
      user: updatedUser,
    }
  }
}