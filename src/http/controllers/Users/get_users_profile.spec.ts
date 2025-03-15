import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { assertPasswordMatches, assertUserProperties } from '@/use-cases/helpers/test-assertions'
import { randomUUID } from 'node:crypto'
import { makeUserData } from '@/use-cases/factories/User/make-user-data-test'
import { createUser } from '@/use-cases/factories/User/create-user'

describe('Get Users Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get users profile', async () => {
    const user = await createAndAuthenticateUser(app)
    const user1 = await createUser()
    const user2 = await createUser()

    const users = await request(app.server)
      .get(`/users/${1}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(users.statusCode).toEqual(200)
    expect(users.body.users).toHaveLength(3)
    expect(users.body.users).toEqual([
      expect.objectContaining({ name: user.user.name }),
      expect.objectContaining({ name: user1.name }),
      expect.objectContaining({ name: user2.name }),
    ])
  })

  it('should be return 404 when user not found', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const getUserResponse = await request(app.server)
      .get(`/user/${randomUUID()}`)
      .set('Authorization', `Bearer ${token}`)

    expect(getUserResponse.statusCode).toEqual(404)
    expect(getUserResponse.body.message).toEqual('User not found.')
  })

  it('should be return 401 when user not authenticated', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicnVsZSI6IlFBIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MjA5ODg2MjJ9.MJN9SdQNFQGWJc_Yb-xHSXPWNm7I1KqXgT8-MxbVDp0'
    const { user } = await createAndAuthenticateUser(app)
    const getUserResponse = await request(app.server)
      .get(`/user/${user.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(getUserResponse.statusCode).toEqual(401)
    expect(getUserResponse.body.message).toEqual('Unauthorized')
  })
})
