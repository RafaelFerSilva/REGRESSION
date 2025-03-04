import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository"
import { beforeEach, describe, expect, it } from "vitest"
import { hash } from "bcryptjs"
import { ResourceNotFoundError } from "./erros/resource-not-found-error"
import { InMemoryTeamsRepository } from "@/repositories/in-memory/in-memory-team-repository"
import { GetTeamUseCase } from "./get-team"
import { randomUUID } from "node:crypto"
import { User } from "@prisma/client"

let teamsRepository: InMemoryTeamsRepository
let sut: GetTeamUseCase

let usersRepository: InMemoryUsersRepository
let user: User

describe('Get Team Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    teamsRepository = new InMemoryTeamsRepository()
    sut = new GetTeamUseCase(teamsRepository)

    user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })
  })

  it('should be able get team', async () => {
    const { id, name, created_at } = await teamsRepository.create({
      name: `Team ${randomUUID()}`,
      userId: user.id
    })

    const { team } = await sut.execute({ teamId: id })

    expect(name).toEqual(team.name)
    expect(created_at).toEqual(team.created_at)
  })

  it('should not be able to get team with wrong id', async () => {
    await expect(() =>
      sut.execute({ teamId: 'no-existing.id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

