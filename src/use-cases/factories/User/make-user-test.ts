import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'

interface CreateUserParams {
  id?: string
  name?: string
  email?: string
  password?: string
  role?: string
  active?: boolean
}

export async function makeUser(
  usersRepository: InMemoryUsersRepository,
  override: CreateUserParams = {},
): Promise<User> {
  const password = override.password || '123456'

  const user = await usersRepository.create({
    id: override.id || randomUUID(),
    name: override.name || 'John Doe',
    email: override.email || `user-${randomUUID().substring(0, 8)}@example.com`,
    password_hash: await hash(password, 6),
    role: override.role || 'USER',
    active: override.active !== undefined ? override.active : true,
  })

  return user
}
