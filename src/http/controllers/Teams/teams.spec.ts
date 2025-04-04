import { beforeAll, afterAll, describe, expect, it, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { makeTeamData } from '@/use-cases/factories/User/make-team-data-test'
import { prisma } from 'lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

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

  it('should be able to register team if user are ADMIN', async () => {
    const { user, token } = await createAndAuthenticateUser(app, 'ADMIN')
    const team = makeTeamData()
    const response = await request(app.server)
      .post('/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: team.name,
      })

    const createdTeam = response.body.team.team
    expect(response.statusCode).toEqual(201)
    expect(createdTeam.name).toEqual(team.name)
    expect(createdTeam.userId).toEqual(user.id)
  })

  it('should not be able to register team if user not are ADMIN', async () => {
    const { token } = await createAndAuthenticateUser(app, 'USER')
    const team = makeTeamData()
    const response = await request(app.server)
      .post('/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: team.name,
      })

    expect(response.statusCode).toEqual(401)
    expect(response.body.message).toEqual('Unauthorized')
  })
})
