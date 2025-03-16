import { hash } from "bcryptjs";
import { UsersRepository } from "@/repositories/interfaces/users-repository";
import { UserNotFoundError } from "../errors/user-not-found-error";
import { EmailAlreadyExistError } from "../errors/email-already-exists-error";
import { PasswordError } from "../errors/password-error";
import { User } from "@prisma/client";

interface UpdateUserUseCaseRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  active?: boolean;
}

interface UpdateUserUseCaseResponse {
  user: User;
}

export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string, data: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const userById = await this.usersRepository.findById(userId);
    if (!userById) throw new UserNotFoundError();

    const updateData: Partial<User> = {};

    if (data.email && data.email !== userById.email) {
      const userByEmail = await this.usersRepository.findbyEmail(data.email);
      if (userByEmail && userByEmail.id !== userById.id) {
        throw new EmailAlreadyExistError();
      }
      updateData.email = data.email;
    }

    if (data.password && data.password !== userById.password_hash) {
      if (data.password.length < 6) throw new PasswordError();
      updateData.password_hash = await hash(data.password, 6);
    }

    if (data.name && data.name !== userById.name) updateData.name = data.name;
    if (data.role && data.role !== userById.role) updateData.role = data.role;
    if (typeof data.active === "boolean" && data.active !== userById.active && data.active !== undefined && data.active !== null) {
      updateData.active = data.active;
    }

    if (Object.keys(updateData).length === 0) {
      return { user: userById };
    }

    const updatedUser = await this.usersRepository.update(userId, updateData);

    return { user: updatedUser };
  }
}
