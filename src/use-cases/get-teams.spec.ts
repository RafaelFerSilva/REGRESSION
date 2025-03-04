import { beforeEach, describe, expect, it } from "vitest"
import { hash } from "bcryptjs"
import { InMemoryTeamsRepository } from "@/repositories/in-memory/in-memory-team-repository"
import { GetTeamsUseCase } from "./get-teams"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository"
import { User } from "@prisma/client"

let teamsRepository: InMemoryTeamsRepository
let sut: GetTeamsUseCase

let usersRepository: InMemoryUsersRepository
let user: User

describe('Get All Teams Use Case', () => {
  beforeEach(async () => {
    teamsRepository = new InMemoryTeamsRepository()
    sut = new GetTeamsUseCase(teamsRepository)

    usersRepository = new InMemoryUsersRepository()
    user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })
  })

  it('should be able fetch all teams', async () => {
    await teamsRepository.create({
      name: 'team-01',
      userId: user.id
    })

    await teamsRepository.create({
      name: 'team-02',
      userId: user.id
    })

    const { teams } = await sut.execute({
      page: 1
    })

    expect(teams).toHaveLength(2)
    expect(teams).toEqual([
      expect.objectContaining({ name: 'team-01' }),
      expect.objectContaining({ name: 'team-02' }),
    ])
  })

  it('should be able to fetch all paginated users profiles', async () => {
    for (let i = 1; i <= 22; i++) {
      await teamsRepository.create({
        name: `team-${i}`,
        userId: user.id
      })
    }

    const { teams } = await sut.execute({
      page: 2
    })

    expect(teams).toHaveLength(2)
    expect(teams).toEqual([
      expect.objectContaining({ name: 'team-21' }),
      expect.objectContaining({ name: 'team-22' }),
    ])
  })
})

