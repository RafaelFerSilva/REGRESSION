import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { makeUserData } from '@/use-cases/factories/User/make-user-data-test'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { assertPasswordMatches, assertUserProperties } from '@/use-cases/helpers/test-assertions'
import { randomUUID } from 'node:crypto'

describe('Update User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update user', async () => {
    const { token, user } = await createAndAuthenticateUser(app)
    const newUser = makeUserData()

    const response = await request(app.server)
      .patch('/update_user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: user.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.message).toEqual('User updated successfully')

    const getUserResponse = await request(app.server)
      .get(`/user/${user.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(getUserResponse.statusCode).toEqual(200)
    assertUserProperties(getUserResponse.body.user, newUser)
    await assertPasswordMatches(newUser.password, getUserResponse.body.user.password_hash)
  })

  it('should return 409 when email already exists', async () => {
    const user1 = await createAndAuthenticateUser(app)
    const user2 = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .patch('/update_user')
      .set('Authorization', `Bearer ${user1.token}`)
      .send({
        id: user2.user.id,
        name: 'Updated User',
        email: user1.user.email,
        password: '123456',
        role: 'user'
      })

    expect(response.statusCode).toEqual(409)
    expect(response.body.message).toEqual('E-mail already exists.')
  })

  it('should return 400 when user not found', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const newUser = makeUserData()
    const uuid = randomUUID()

    const response = await request(app.server)
      .patch('/update_user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: uuid,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toEqual('User not found.')
  })

  it('should return 400 when password format is invalid', async () => {
    const { token, user } = await createAndAuthenticateUser(app)
    const newUser = makeUserData()

    const response = await request(app.server)
      .patch('/update_user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: user.id,
        name: newUser.name,
        email: newUser.email,
        password: '123',
        role: newUser.role
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toEqual('Validation error')
  })

  it('should return 400 when e-mail format is invalid', async () => {
    const { token, user } = await createAndAuthenticateUser(app)
    const newUser = makeUserData()

    const response = await request(app.server)
      .patch('/update_user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: user.id,
        name: newUser.name,
        email: newUser.email,
        password: '123',
        role: newUser.role
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toEqual('Validation error')
  })

  it('should return 400 when required fields (userId) are missing', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const newUser = makeUserData()

    const response = await request(app.server)
      .patch('/update_user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: newUser.name,
        email: newUser.email,
        password: '123',
        role: newUser.role
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toEqual('Validation error')
  });

  it('should return 400 when required fields (userId) are empty', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const newUser = makeUserData()

    const response = await request(app.server)
      .patch('/update_user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: '',
        name: newUser.name,
        email: newUser.email,
        password: '123',
        role: newUser.role
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toEqual('Validation error')
  });
})
