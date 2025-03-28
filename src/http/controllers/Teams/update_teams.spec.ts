import { beforeAll, afterAll, describe, expect, it, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { makeTeamData } from '@/use-cases/factories/User/make-team-data-test'
import { prisma } from 'lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { createTeam } from '@/use-cases/factories/User/create-team'

describe('Teams Register (e2e)', () => {
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

  it('should be able to update team if user are ADMIN', async () => {
    const { user, token } = await createAndAuthenticateUser(app, 'ADMIN')
    const team1 = await createTeam({ user, token })

    const newTeam = makeTeamData()
    const response = await request(app.server)
      .patch('/update_team')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: team1.team.id,
        name: newTeam.name,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.message).toEqual('Teams updated successfully')
  })

  it('should not be able to update team if user not are ADMIN', async () => {
    const admin = await createAndAuthenticateUser(app, 'ADMIN')
    const team1 = await createTeam({ user: admin.user, token: admin.token })

    const user = await createAndAuthenticateUser(app, 'USER')

    const newTeam = makeTeamData()
    const response = await request(app.server)
      .patch('/update_team')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        id: team1.team.id,
        name: newTeam.name,
      })

    expect(response.statusCode).toEqual(401)
    expect(response.body.message).toEqual('Unauthorized')
  })
})
