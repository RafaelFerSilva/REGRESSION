import { beforeAll, afterAll, describe, expect, it, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from 'lib/prisma'
import { createTeam } from '@/use-cases/factories/User/create-team'

describe('Get Teams (e2e)', () => {
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

  it('should be able to get all Teams', async () => {
    const admin1 = await createAndAuthenticateUser(app, 'ADMIN')
    const team1 = await createTeam({ user: admin1.user, token: admin1.token })

    const admin2 = await createAndAuthenticateUser(app, 'ADMIN')
    const team2 = await createTeam({ user: admin2.user, token: admin2.token })

    const user = await createAndAuthenticateUser(app, 'QA')

    const teams = await request(app.server)
      .get(`/teams/${1}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(teams.statusCode).toEqual(200)
    expect(teams.body.teams).toHaveLength(2)
    expect(teams.body.teams).toEqual([
      expect.objectContaining({ name: team1.team.name }),
      expect.objectContaining({ name: team2.team.name }),
    ])
  })

  it('should be able to fetch all paginated teams', async () => {
    const { user, token } = await createAndAuthenticateUser(app, 'ADMIN')
    for (let i = 1; i <= 22; i++) {
      await createTeam({ user, token }, { name: `team-${i}` })
    }

    const qa = await createAndAuthenticateUser(app, 'QA')

    const teams = await request(app.server)
      .get(`/teams/${2}`)
      .set('Authorization', `Bearer ${qa.token}`)

    expect(teams.statusCode).toEqual(200)
    expect(teams.body.teams).toHaveLength(2)
    expect(teams.body.teams).toEqual([
      expect.objectContaining({ name: 'team-21' }),
      expect.objectContaining({ name: 'team-22' }),
    ])
  })
})
