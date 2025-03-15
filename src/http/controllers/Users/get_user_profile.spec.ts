import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { assertPasswordMatches, assertUserProperties } from '@/use-cases/helpers/test-assertions'
import { randomUUID } from 'node:crypto'

describe('Get User Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const { token, user } = await createAndAuthenticateUser(app)

    const getUserResponse = await request(app.server)
      .get(`/user/${user.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(getUserResponse.statusCode).toEqual(200)
    expect(user.id).toEqual(getUserResponse.body.user.id)
    assertUserProperties(getUserResponse.body.user, user)
  })

  it('should be return 404 when user not found', async () => {
    const { token, user } = await createAndAuthenticateUser(app)
    const getUserResponse = await request(app.server)
    .get(`/user/${randomUUID()}`)
    .set('Authorization', `Bearer ${token}`)

    expect(getUserResponse.statusCode).toEqual(404)
    expect(getUserResponse.body.message).toEqual('User not found.')
  })
})
