import { randomUUID } from 'node:crypto'

interface MakeUserParams {
  id?: string
  name?: string
  email?: string
  password?: string
  role?: string
  active?: boolean
}

interface MakeUserResponse {
  name: string
  email: string
  password: string
  role: string
  active: boolean
}

export function makeUserData(override: MakeUserParams = {}): MakeUserResponse {
  const user = {
    name: override.name || 'John Doe',
    email: override.email || `user-${randomUUID().substring(0, 8)}@example.com`,
    password: override.password || '123456',
    role: override.role || 'USER',
    active: override.active !== undefined ? override.active : true,
  }

  return user
}
