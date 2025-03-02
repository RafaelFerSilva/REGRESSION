import { prisma } from "lib/prisma";
import { hash } from "bcryptjs";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistError } from "./erros/user-already-exists-error";

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
      throw new UserAlreadyExistError()
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