import { beforeAll, afterAll, describe, expect, it, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from 'lib/prisma'
import { createTeam } from '@/use-cases/factories/User/create-team'

describe('Get User Teams (e2e)', () => {
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

  it('should be able to get users Teams', async () => {
    const user = await createAndAuthenticateUser(app)
    const team1 = await createTeam(user)
    const team2 = await createTeam(user)

    const teams = await request(app.server)
      .get(`/user_teams/${user.user.id}/${1}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(teams.statusCode).toEqual(200)
    expect(teams.body.teams).toHaveLength(2)
    expect(teams.body.teams).toEqual([
      expect.objectContaining({ name: team1.team.name }),
      expect.objectContaining({ name: team2.team.name }),
    ])
  })

  it('should be able to fetch all paginated users teams', async () => {
    const user = await createAndAuthenticateUser(app)
    for (let i = 1; i <= 22; i++) {
      await createTeam(user, { name: `team-${i}` })
    }

    const teams = await request(app.server)
      .get(`/user_teams/${user.user.id}/${2}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(teams.statusCode).toEqual(200)
    expect(teams.body.teams).toHaveLength(2)
    expect(teams.body.teams).toEqual([
      expect.objectContaining({ name: 'team-21' }),
      expect.objectContaining({ name: 'team-22' }),
    ])
  })
})
