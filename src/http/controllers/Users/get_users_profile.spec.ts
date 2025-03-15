import { beforeAll, afterAll, describe, expect, it, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { createUser } from '@/use-cases/factories/User/create-user'
import { prisma } from 'lib/prisma'

describe('Get Users Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
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

  it('should be able to fetch all paginated users profiles', async () => {
    const user = await createAndAuthenticateUser(app)
    for (let i = 1; i <= 22; i++) {
      await createUser({ name: `user-${i}`})
    }

    const users = await request(app.server)
    .get(`/users/${2}`)
    .set('Authorization', `Bearer ${user.token}`)

    expect(users.statusCode).toEqual(200)
    expect(users.body.users).toHaveLength(3)
    expect(users.body.users).toEqual([
      expect.objectContaining({ name: 'user-20' }),
      expect.objectContaining({ name: 'user-21' }),
      expect.objectContaining({ name: 'user-22' }),
    ])
  })
})
