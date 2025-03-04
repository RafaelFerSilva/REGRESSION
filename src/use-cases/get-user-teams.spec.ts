import { beforeEach, describe, expect, it } from "vitest"
import { hash } from "bcryptjs"
import { InMemoryTeamsRepository } from "@/repositories/in-memory/in-memory-team-repository"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository"
import { User } from "@prisma/client"
import { GetUserTeamsUseCase } from "./get-user-teams"
import { randomUUID } from "node:crypto"
import { ResourceNotFoundError } from "./erros/resource-not-found-error"

let teamsRepository: InMemoryTeamsRepository
let sut: GetUserTeamsUseCase

let usersRepository: InMemoryUsersRepository
let user_01: User
let user_02: User

describe('Get User Teams Use Case', () => {
  beforeEach(async () => {
    teamsRepository = new InMemoryTeamsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserTeamsUseCase(teamsRepository, usersRepository)

    user_01 = await usersRepository.create({
      id: 'user-01',
      name: 'user-01',
      email: 'user-01@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })

    user_02 = await usersRepository.create({
      id: 'user-02',
      name: 'user-02',
      email: 'user-02@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })
  })

  it('should be able fetch all user teams', async () => {
    await teamsRepository.create({
      id: randomUUID(),
      name: 'team-01',
      userId: user_01.id
    })

    await teamsRepository.create({
      id: randomUUID(),
      name: 'team-02',
      userId: user_01.id
    })

    await teamsRepository.create({
      id: randomUUID(),
      name: 'team-03',
      userId: user_02.id
    })

    const user_01_teams = await sut.execute({
      userId: user_01.id
    })

    expect(user_01_teams.teams).toHaveLength(2)
    expect(user_01_teams.teams).toEqual([
      expect.objectContaining({ name: 'team-01' }),
      expect.objectContaining({ name: 'team-02' }),
    ])

    const user_02_teams = await sut.execute({
      userId: user_02.id
    })

    expect(user_02_teams.teams).toHaveLength(1)
    expect(user_02_teams.teams).toEqual([
      expect.objectContaining({ name: 'team-03' }),
    ])
  })

  it('should be able to fetch all paginated user teams', async () => {
    for (let i = 1; i <= 22; i++) {
      await teamsRepository.create({
        id: `team-${i}`,
        name: `team-${i}`,
        userId: user_01.id
      })
    }

    const { teams } = await sut.execute({
      userId: user_01.id,
      page: 2
    })

    expect(teams).toHaveLength(2)
    expect(teams).toEqual([
      expect.objectContaining({ name: 'team-21' }),
      expect.objectContaining({ name: 'team-22' }),
    ])
  })

  it('should not be able to fetch teams of non existing user', async () => {
    await teamsRepository.create({
      id: randomUUID(),
      name: 'team-01',
      userId: user_01.id
    })

    await expect(() =>
      sut.execute({
        userId: 'non-existing-user',
        page: 1
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

