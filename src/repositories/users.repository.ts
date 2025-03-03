import { UserResponse } from "@/interfaces/user.interfaces";
import { Prisma, User } from "@prisma/client";

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findbyEmail(email: string): Promise<UserResponse | null>
  findById(id: string): Promise<UserResponse | null>
}
