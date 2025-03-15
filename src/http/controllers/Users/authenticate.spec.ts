import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { makeUserData } from '@/use-cases/factories/User/make-user-data-test'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate user', async () => {
    const newUser = makeUserData()
    await request(app.server).post('/users').send({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      rule: newUser.rule,
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: newUser.email,
      password: newUser.password,
    })

    expect(authResponse.statusCode).toEqual(200)
    expect(authResponse.body).toEqual({
      token: expect.any(String),
    })
  })

  it('should not be able to authenticate non existing user', async () => {
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'fake@user.com',
      password: '123456',
    })

    console.log(authResponse.body)

    expect(authResponse.statusCode).toEqual(400)
    expect(authResponse.body.message).toEqual('Invalid Credentials')
  })

  it('should return 400 when email format is invalid', async () => {
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'fake user',
      password: '123456',
    })

    console.log(authResponse.body)

    expect(authResponse.statusCode).toEqual(400)
    expect(authResponse.body.message).toEqual('Validation error')
  })
})
