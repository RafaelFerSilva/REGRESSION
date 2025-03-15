import { User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { app } from '@/app'
import request from 'supertest'

interface CreateUserParams {
  id?: string
  name?: string
  email?: string
  password?: string
  rule?: string
  active?: boolean
}

interface UserResponse {
  id: string
  name: string
  email: string
  rule: string
  active: boolean
}


export async function createUser(
  override: CreateUserParams = {}
): Promise<UserResponse> {
  const password = override.password || '123456'

  const user = await request(app.server).post('/users').send({
    name: override.name || `John Doe ${randomUUID().substring(0, 8)}`,
    email: override.email || `user-${randomUUID().substring(0, 8)}@example.com`,
    password: password,
    rule: override.rule || 'USER',
    active: override.active !== undefined ? override.active : true,
  })

  return {
    id: user.body.user.id,
    name: user.body.user.name,
    email: user.body.user.email,
    rule: user.body.user.rule,
    active: user.body.user.active,
  }
}