import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'

interface CreateUserParams {
  id?: string
  name?: string
  email?: string
  password?: string
  rule?: string
  active?: boolean
}

export function makeUserData(
  override: CreateUserParams = {}
): CreateUserParams {
  const password = override.password || '123456'
  
  const user = {
    name: override.name || 'John Doe',
    email: override.email || `user-${randomUUID().substring(0, 8)}@example.com`,
    password: override.password || '123456',
    rule: override.rule || 'QA',
    active: override.active !== undefined ? override.active : true,
  }

  return user
}