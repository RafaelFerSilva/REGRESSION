import { beforeEach, describe, expect, it } from "vitest"
import { User } from "@prisma/client"
import { UserNotFoundError } from "../errors/user-not-found-error"
import { setupTeamRepositoryAndUseCase } from "../helpers/setup-repositories"
import { makeUser } from "../factories/user-factory"
import { makeTeam } from "../factories/team-factory"

describe('Get User Teams Use Case', () => {
  let usersRepository: ReturnType<typeof setupTeamRepositoryAndUseCase>['usersRepository']
  let teamsRepository: ReturnType<typeof setupTeamRepositoryAndUseCase>['teamsRepository']
  let sut: ReturnType<typeof setupTeamRepositoryAndUseCase>['getUserTeamsUseCase']
  let user_01: User
  let user_02: User
  
  beforeEach(async () => {
    const teamSetup = setupTeamRepositoryAndUseCase()
    teamsRepository = teamSetup.teamsRepository
    sut = teamSetup.getUserTeamsUseCase

    usersRepository = teamSetup.usersRepository

    user_01 = await makeUser(usersRepository)
    user_02 = await makeUser(usersRepository)
  })

  it('should be able fetch all user teams', async () => {
    // Arrange
    const team1 = await makeTeam(teamsRepository, { userId: user_01.id })
    const team2 = await makeTeam(teamsRepository, { userId: user_01.id })
    const team3 =await makeTeam(teamsRepository, { userId: user_02.id })
    
    // Act
    const user_01_teams = await sut.execute({
      userId: user_01.id
    })

    // Assert
    expect(user_01_teams.teams).toHaveLength(2)
    expect(user_01_teams.teams).toEqual([
      expect.objectContaining({ name: team1.name }),
      expect.objectContaining({ name: team2.name }),
    ])

    // Act
    const user_02_teams = await sut.execute({
      userId: user_02.id
    })

    // Assert
    expect(user_02_teams.teams).toHaveLength(1)
    expect(user_02_teams.teams).toEqual([
      expect.objectContaining({ name: team3.name }),
    ])
  })

  it('should be able to fetch all paginated user teams', async () => {
    // Arrange
    for (let i = 1; i <= 22; i++) {
      await makeTeam(teamsRepository, { 
        id: `team-${i}`,
        name: `team-${i}`,
        userId: user_01.id
       })
    }

    // Act
    const { teams } = await sut.execute({
      userId: user_01.id,
      page: 2
    })

    // Assert
    expect(teams).toHaveLength(2)
    expect(teams).toEqual([
      expect.objectContaining({ name: 'team-21' }),
      expect.objectContaining({ name: 'team-22' }),
    ])
  })

  it('should not be able to fetch teams of non existing user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-user',
        page: 1
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})

