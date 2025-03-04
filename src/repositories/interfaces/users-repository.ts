import { Prisma, User } from "@prisma/client";

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findbyEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  findAll(page: number): Promise<User[] | []>
  findByRule(rule: string, page?: number): Promise<User[] | []>
  update(id: string, data: Prisma.UserCreateInput): Promise<User>
}
