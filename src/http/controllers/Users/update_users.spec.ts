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
        rule: newUser.rule
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
})
