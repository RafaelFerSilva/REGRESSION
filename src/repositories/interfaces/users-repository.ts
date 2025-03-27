import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findbyEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  findAll(page: number): Promise<User[] | []>
  findByRole(role: string, page?: number): Promise<User[] | []>
  update(id: string, data: Partial<Prisma.UserCreateInput>): Promise<User>
}
