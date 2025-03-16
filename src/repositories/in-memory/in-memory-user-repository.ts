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
      role: data.role ?? 'USER',
      active: data.active ?? true,
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

  async findByRole(role: string, page?: number) {
    if (page) {
      return this.items
      .filter((item) => item.role == role)
      .slice((page - 1) * 20, page * 20)
    }
    
    return this.items.filter((item) => item.role === role)
  }

  async update(id: string, data: Prisma.UserCreateInput){
    const index = this.items.findIndex((item) => item.id == id)
    if (data.name) this.items[index].name = data.name
    if (data.email) this.items[index].email = data.email
    if (data.role) this.items[index].role = data.role
    if (data.active !== undefined) this.items[index].active = data.active
    if (data.password_hash) this.items[index].password_hash = data.password_hash
    return this.items[index]
  }
}