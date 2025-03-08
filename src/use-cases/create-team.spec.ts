import { InMemoryTeamsRepository } from "@/repositories/in-memory/in-memory-team-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateTeamUseCase } from "./create-teams";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { hash } from "bcryptjs";
import { User } from "@prisma/client";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { TeamAlreadyExistError } from "./errors/team-already-exists-error";
import { randomUUID } from 'node:crypto'

describe('Team Use Case', () => {
  let teamsRepository: InMemoryTeamsRepository
  let sut: CreateTeamUseCase

  let usersRepository: InMemoryUsersRepository
  let user: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    teamsRepository = new InMemoryTeamsRepository()
    sut = new CreateTeamUseCase(teamsRepository, usersRepository)

    user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })
  })

  it('should be able to create a new team', async () => {
    const { team } = await sut.execute({
      name: `Team ${randomUUID()}`,
      userId: user.id
    })
  })

  it('should not be able to create a new team with not existing user', async () => {
    await expect(
      sut.execute({
        name: `Team ${randomUUID()}`,
        userId: 'no-existing-user'
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to create a new team with empty user id', async () => {
    await expect(
      sut.execute({
        name: `Team ${randomUUID()}`,
        userId: ''
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to create a new team with already existing name', async () => {
    const teamName = 'Team 1'
    await sut.execute({
      name: teamName,
      userId: user.id
    })

    await expect(
      sut.execute({
        name: teamName,
        userId: user.id
      })
    ).rejects.toBeInstanceOf(TeamAlreadyExistError)
  })
})