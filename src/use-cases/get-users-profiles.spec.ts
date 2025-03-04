import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository"
import { beforeEach, describe, expect, it } from "vitest"
import { hash } from "bcryptjs"
import { GetUsersProfilesUseCase } from "./get-users-profiles"

let usersRepository: InMemoryUsersRepository
let sut: GetUsersProfilesUseCase

describe('Get All Users Profiles Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUsersProfilesUseCase(usersRepository)
  })

  it('should be able fetch all users profiles', async () => {
    await usersRepository.create({
      name: 'user-01',
      email: 'user-01@example.com',
      password_hash: await hash('123456', 6),
      rule: 'ADMIN',
      active: true
    })

    await usersRepository.create({
      name: 'user-02',
      email: 'user-02@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })

    const { users } = await sut.execute({
      page: 1
    })

    expect(users).toHaveLength(2)
    expect(users).toEqual([
      expect.objectContaining({ name: 'user-01' }),
      expect.objectContaining({ name: 'user-02' }),
    ])
  })

  it('should be able to fetch all paginated users profiles', async () => {
    for (let i = 1; i <= 22; i++) {
      await usersRepository.create({
        name: `user-${i}`,
        email: `user-${i}@example.com`,
        password_hash: await hash('123456', 6),
        rule: 'QA',
        active: true
      })
    }

    const { users } = await sut.execute({
      page: 2
    })

    expect(users).toHaveLength(2)
    expect(users).toEqual([
      expect.objectContaining({ name: 'user-21' }),
      expect.objectContaining({ name: 'user-22' }),
    ])
  })
})

