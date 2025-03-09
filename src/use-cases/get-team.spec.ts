
import { beforeEach, describe, expect, it } from "vitest"
import { User } from "@prisma/client"
import { TeamNotFoundError } from "./errors/team-not-found-error"
import { setupTeamRepositoryAndUseCase, setupUserRepositoryAndUseCase } from "./helpers/setup-repositories"
import { makeUser } from "./factories/user-factory"
import { makeTeam } from "./factories/team-factory"
import { assertTeamProperties } from "./helpers/test-assertions"

describe('Get Team Use Case', () => {
  let teamsRepository: ReturnType<typeof setupTeamRepositoryAndUseCase>['teamsRepository']
  let usersRepository: ReturnType<typeof setupUserRepositoryAndUseCase>['usersRepository']
  let sut: ReturnType<typeof setupTeamRepositoryAndUseCase>['getTeamUseCase']
  let user: User

  beforeEach(async () => {
    const teamSetup = setupTeamRepositoryAndUseCase()
    teamsRepository = teamSetup.teamsRepository
    sut = teamSetup.getTeamUseCase

    const userSetup = setupUserRepositoryAndUseCase()
    usersRepository = userSetup.usersRepository

    // Criar usuário de teste usando a factory
    user = await makeUser(usersRepository)
  })

  it('should be able get team', async () => {
    // Arrange
    const createdTeam  = await makeTeam(teamsRepository, {
      name: 'Team 1',
      userId: user.id
    })

     // Act
    const { team } = await sut.execute({ teamId: createdTeam.id })

    // Assert
    assertTeamProperties(team, {
      name: createdTeam.name,
      active: true,
      id: createdTeam.id,
      created_at: createdTeam.created_at,
      updated_at: createdTeam.updated_at,
      userId: createdTeam.userId
    })
  })

  it('should not be able to get team with wrong id', async () => {
    await expect(() =>
      sut.execute({ teamId: 'no-existing.id' }),
    ).rejects.toBeInstanceOf(TeamNotFoundError)
  })
})

