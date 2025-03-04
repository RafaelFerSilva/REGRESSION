import { prisma } from "lib/prisma";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../interfaces/users-repository";

export class PrismaUsersRepository implements UsersRepository {

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findbyEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findAll(page: number) {
    const users = await prisma.user.findMany()
    return users.slice((page - 1) * 20, page * 20)
  }
}