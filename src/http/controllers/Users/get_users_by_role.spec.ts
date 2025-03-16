import { beforeAll, afterAll, describe, expect, it, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { createUser } from '@/use-cases/factories/User/create-user'
import { prisma } from 'lib/prisma'

describe('Get Users By Role (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  it('should be able to get users by Role', async () => {
    const user = await createAndAuthenticateUser(app)
    const user1 = await createUser({ role: 'QA'})
    const user2 = await createUser({ role: 'QA'})

    const users = await request(app.server)
      .get(`/user_by_role/QA/${1}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(users.statusCode).toEqual(200)
    expect(users.body.users).toHaveLength(2)
    expect(users.body.users).toEqual([
      expect.objectContaining({ name: user1.name, role: user1.role }),
      expect.objectContaining({ name: user2.name, role: user2.role }),
    ])
  })

  it('should be able to fetch all paginated users by role', async () => {
    const user = await createAndAuthenticateUser(app)
    for (let i = 1; i <= 22; i++) {
      await createUser({ name: `user-${i}`})
    }

    const users = await request(app.server)
      .get(`/user_by_role/USER/${2}`)
      .set('Authorization', `Bearer ${user.token}`)

    expect(users.statusCode).toEqual(200)
    expect(users.body.users).toHaveLength(3)
    expect(users.body.users).toEqual([
      expect.objectContaining({ name: 'user-20', role: 'USER' }),
      expect.objectContaining({ name: 'user-21', role: 'USER' }),
      expect.objectContaining({ name: 'user-22', role: 'USER' }),
    ])
  })
})
