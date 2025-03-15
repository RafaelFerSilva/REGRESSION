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

  it('should not be able to register user with duplicated email', async () => {
    const newUser = makeUserData()
    await request(app.server).post('/users').send({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
    })

    const duplicatedEmailResponse = await request(app.server).post('/users').send({
      name: 'New name',
      email: newUser.email,
      password: '123456',
    })

    expect(duplicatedEmailResponse.statusCode).toEqual(409)
    expect(duplicatedEmailResponse.body.message).toEqual('Email already exists')
  })

  it('should return 400 when required fields are missing', async () => {
    const response = await request(app.server).post('/users').send({
      // Não enviar o campo name, que é obrigatório
      email: 'test@example.com',
      password: '123456'
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual('Validation error')
  });

  it('should return 400 when email format is invalid', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Test User',
      email: 'invalid-email',
      password: '123456'
    });

    expect(response.statusCode).toEqual(400);
  });
})
