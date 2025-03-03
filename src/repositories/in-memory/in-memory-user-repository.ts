import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users.repository";

export class InMemoryUserRepository implements UsersRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      rule: data.rule,
      active: data.active,
      created_at: new Date()
    }

    this.items.push(user)
    return user
  }

  async findbyEmail(email: string) {
    const user = this.items.find((item) => item.email == email)

    if (!user) {
      return null
    }

    return user
  }
}