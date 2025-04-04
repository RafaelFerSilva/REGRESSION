import { hash } from 'bcryptjs'
import { UserAlreadyExistError } from '../errors/user-already-exists-error'
import { Role, User } from '@prisma/client'
import { UsersRepository } from '@/repositories/interfaces/users-repository'
import { InvalidRoleError } from '../errors/invalid-role-error'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  password: string
  role?: string
}

interface CreateUserUseCaseResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const validRoles = role as Role
    if (role && !Object.values(Role).includes(validRoles)) {
      throw new InvalidRoleError()
    }

    const password_hash = await hash(password, 6)
    const userWithSameEmail = await this.usersRepository.findbyEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      role: validRoles,
    })

    return {
      user,
    }
  }
}
