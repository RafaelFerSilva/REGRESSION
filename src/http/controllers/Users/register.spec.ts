import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { makeUserData } from '@/use-cases/factories/User/make-user-data-test'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register user', async () => {
    const newUser = makeUserData()
    const response = await request(app.server).post('/users').send({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      rule: newUser.rule,
    })

    const createdUser = response.body.user
    expect(response.statusCode).toEqual(201)
    expect(createdUser.name).toEqual(newUser.name)
    expect(createdUser.email).toEqual(newUser.email)
    expect(createdUser.rule).toEqual(newUser.rule)
  })

  it('should be able to register user', async () => {
    const newUser = makeUserData()
    const response = await request(app.server).post('/users').send({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    })

    const createdUser = response.body.user
    expect(response.statusCode).toEqual(201)
    expect(createdUser.name).toEqual(newUser.name)
    expect(createdUser.email).toEqual(newUser.email)
    expect(createdUser.rule).toEqual('USER')
  })
})
