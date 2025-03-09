import { beforeEach, describe, expect, it } from "vitest"
import { User } from "@prisma/client"
import { setupTeamRepositoryAndUseCase, setupUserRepositoryAndUseCase } from "../helpers/setup-repositories"
import { makeUser } from "../factories/User/make-user-test"
import { makeTeam } from "../factories/Team/make-team-test"

describe('Get All Teams Use Case', () => {
  let teamsRepository: ReturnType<typeof setupTeamRepositoryAndUseCase>['teamsRepository']
  let usersRepository: ReturnType<typeof setupUserRepositoryAndUseCase>['usersRepository']
  let sut: ReturnType<typeof setupTeamRepositoryAndUseCase>['getTeamsUseCase']
  let user: User

  beforeEach(async () => {
    const teamSetup = setupTeamRepositoryAndUseCase()
    teamsRepository = teamSetup.teamsRepository
    sut = teamSetup.getTeamsUseCase

    const userSetup = setupUserRepositoryAndUseCase()
    usersRepository = userSetup.usersRepository

    // Criar usuário de teste usando a factory
    user = await makeUser(usersRepository)
  })

  it('should be able fetch all teams', async () => {
    // Arrange
    await makeTeam(teamsRepository, {
      name: 'team-01',
      userId: user.id
    })

    await makeTeam(teamsRepository, {
      name: 'team-02',
      userId: user.id
    })

    // Act
    const { teams } = await sut.execute({
      page: 1
    })

    // Assert
    expect(teams).toHaveLength(2)
    expect(teams).toEqual([
      expect.objectContaining({ name: 'team-01' }),
      expect.objectContaining({ name: 'team-02' }),
    ])
  })

  it('should be able to fetch all paginated teams', async () => {
    // Arrange
    for (let i = 1; i <= 22; i++) {
      await makeTeam(teamsRepository, {
        name: `team-${i}`,
        userId: user.id
      })
    }

    // Act
    const { teams } = await sut.execute({
      page: 2
    })

    // Assert
    expect(teams).toHaveLength(2)
    expect(teams).toEqual([
      expect.objectContaining({ name: 'team-21' }),
      expect.objectContaining({ name: 'team-22' }),
    ])
  })
})

