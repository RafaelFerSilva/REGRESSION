import { beforeAll, afterAll, describe, expect, it, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from 'lib/prisma'
import { createTeam } from '@/use-cases/factories/User/create-team'
import { randomUUID } from 'node:crypto'

describe('Get Team (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.team.deleteMany()
    await prisma.user.deleteMany()
  })

  it('should be able to get team by team Id', async () => {
    const admin = await createAndAuthenticateUser(app, 'ADMIN')
    const team1 = await createTeam({ user: admin.user, token: admin.token })

    const user = await createAndAuthenticateUser(app, 'QA')

    const team = await request(app.server)
      .get(`/team/${team1.team.id}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(team.statusCode).toEqual(200)
    expect(team.body.team).toEqual(team1.team)
  })

  it('should be return 404 (Team not found) if get tem with wrong id', async () => {
    const user = await createAndAuthenticateUser(app, 'QA')

    const response = await request(app.server)
      .get(`/team/${randomUUID()}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(response.statusCode).toEqual(404)
    expect(response.body.message).toEqual('Team not found.')
  })
})
