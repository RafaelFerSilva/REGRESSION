import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../interfaces/users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  
  public items: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: `${data.id}`,
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      rule: data.rule,
      active: data.active,
      created_at: new Date(),
      updated_at: new Date()
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

  async findById(id: string) {
    const user = this.items.find((item) => item.id == id)

    if(!user) {
      return null
    }

    return user
  }

  async findAll(page: number) {
    return this.items.slice((page - 1) * 20, page * 20)
  }

  async findByRule(rule: string, page?: number) {
    if (page) {
      return this.items
      .filter((item) => item.rule == rule)
      .slice((page - 1) * 20, page * 20)
    }
    
    return this.items.filter((item) => item.rule === rule)
  }

  async update(id: string, data: Prisma.UserCreateInput){
    const index = this.items.findIndex((item) => item.id == id)
    if (data.name) this.items[index].name = data.name
    if (data.email) this.items[index].email = data.email
    if (data.rule) this.items[index].rule = data.rule
    if (data.active !== undefined) this.items[index].active = data.active
    if (data.password_hash) this.items[index].password_hash = data.password_hash
    return this.items[index]
  }
}