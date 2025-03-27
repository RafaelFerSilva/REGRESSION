import { Team, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { app } from '@/app'
import request from 'supertest'

interface AuthUser {
  user: User
  token: string
}

interface CreateUserParams {
  name?: string
}

interface CreateTeamResponse {
  team: Team
  userId: string
}

export async function createTeam(
  user: AuthUser,
  override: CreateUserParams = {},
): Promise<CreateTeamResponse> {
  const team = await request(app.server)
    .post('/teams')
    .set('Authorization', `Bearer ${user.token}`)
    .send({
      name: override.name || `Team ${randomUUID().substring(0, 8)}`,
      userId: user.user.id,
    })

  return {
    ...team.body.team,
    userId: user.user.id,
  }
}
