import { prisma } from "lib/prisma";
import { hash } from "bcryptjs";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";

interface RegisterUseCaseRequest {
  name: string,
  email: string,
  password: string,
  rule: string,
  active: boolean
}

export class RegisterUseCase {
  constructor(private usersRepository: any) { }

  async execute({ name, email, password, rule, active }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (userWithSameEmail) {
      throw new Error('Email already exists')
    }

    const prismaUsersRepository = new PrismaUsersRepository()
    await prismaUsersRepository.create({
      name,
      email,
      password_hash,
      rule,
      active
    })
  }
}