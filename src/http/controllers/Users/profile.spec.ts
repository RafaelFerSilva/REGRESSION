import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('User Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const { token, user } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        name: user.name,
        email: user.email,
      }),
    )
  })

  it('should be return 404 when user not found', async () => {
    const token = app.jwt.sign({ sub: '1234567890' }, { expiresIn: '1d' });
    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(404)
    expect(profileResponse.body.message).toEqual('User not found')
  })

  it('should be return 401 when user not authenticated', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicnVsZSI6IlFBIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MjA5ODg2MjJ9.MJN9SdQNFQGWJc_Yb-xHSXPWNm7I1KqXgT8-MxbVDp0'
    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(401)
    expect(profileResponse.body.message).toEqual('Unauthorized')
  })
})
