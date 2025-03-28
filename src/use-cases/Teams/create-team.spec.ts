import { beforeEach, describe, expect, it } from 'vitest'
import { User } from '@prisma/client'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { TeamAlreadyExistError } from '../errors/team-already-exists-error'
import { randomUUID } from 'node:crypto'

import { setupTeamRepositoryAndUseCase } from '@/use-cases/helpers/setup-repositories'
import { assertTeamProperties } from '../helpers/test-assertions'
import { makeUser } from '../factories/User/make-user-test'
import { UnauthorizedError } from '../errors/unauthorizes-error'

describe('Team Use Case', () => {
  let usersRepository: ReturnType<
    typeof setupTeamRepositoryAndUseCase
  >['usersRepository']

  let sut: ReturnType<
    typeof setupTeamRepositoryAndUseCase
  >['createTeamsUseCase']
  let admin: User

  beforeEach(async () => {
    const teamSetup = setupTeamRepositoryAndUseCase()
    sut = teamSetup.createTeamsUseCase

    usersRepository = teamSetup.usersRepository

    // Criar usuário de teste usando a factory
    admin = await makeUser(usersRepository, { role: 'ADMIN' })
  })

  it('should be able to create a new team', async () => {
    const newTeam = {
      name: `Team ${randomUUID()}`,
      userId: admin.id,
    }
    const { team } = await sut.execute({
      name: newTeam.name,
      authenticatedUserId: newTeam.userId,
    })

    assertTeamProperties(team, newTeam)
  })

  it('should not be able to create a new team if user is not ADMIN', async () => {
    const user = await makeUser(usersRepository, { role: 'QA' })

    await expect(
      sut.execute({
        name: `Team ${randomUUID()}`,
        authenticatedUserId: user.id,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should not be able to create a new team with not existing user', async () => {
    await expect(
      sut.execute({
        name: `Team ${randomUUID()}`,
        authenticatedUserId: 'no-existing-user',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to create a new team with empty user id', async () => {
    await expect(
      sut.execute({
        name: `Team ${randomUUID()}`,
        authenticatedUserId: '',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to create a new team with already existing name', async () => {
    const teamName = `Team ${randomUUID()}`
    await sut.execute({
      name: teamName,
      authenticatedUserId: admin.id,
    })

    await expect(
      sut.execute({
        name: teamName,
        authenticatedUserId: admin.id,
      }),
    ).rejects.toBeInstanceOf(TeamAlreadyExistError)
  })
})
