import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository"
import { beforeEach, describe, expect, it } from "vitest"
import { hash } from "bcryptjs"
import { GetUsersByRuleUseCase } from "./get-users-by-rule"

let usersRepository: InMemoryUsersRepository
let sut: GetUsersByRuleUseCase

describe('Get Users By Rule Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUsersByRuleUseCase(usersRepository)
  })

  it('should be able fetch users by user rule', async () => {
    await usersRepository.create({
      name: 'user-01',
      email: 'user-02@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })

    await usersRepository.create({
      name: 'user-02',
      email: 'user-01@example.com',
      password_hash: await hash('123456', 6),
      rule: 'ADMIN',
      active: true
    })

    await usersRepository.create({
      name: 'user-03',
      email: 'user-02@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })

    const qas = await sut.execute({
      rule: 'QA'
    })

    expect(qas.users).toHaveLength(2)
    expect(qas.users).toEqual([
      expect.objectContaining({ name: 'user-01' }),
      expect.objectContaining({ name: 'user-03' }),
    ])

    const admin = await sut.execute({
      rule: 'ADMIN'
    })

    expect(admin.users).toHaveLength(1)
    expect(admin.users).toEqual([
      expect.objectContaining({ name: 'user-02' })
    ])
  })

  it('should be able to fetch paginated users by rule', async () => {
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
      rule: 'QA',
      page: 2
    })

    expect(users).toHaveLength(2)
    expect(users).toEqual([
      expect.objectContaining({ name: 'user-21' }),
      expect.objectContaining({ name: 'user-22' }),
    ])
  })
})

