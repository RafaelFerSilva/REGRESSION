import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository"
import { beforeEach, describe, expect, it } from "vitest"
import { hash } from "bcryptjs"
import { GetUsersProfilesUseCase } from "./get-users-profiles"
import { setupUserRepositoryAndUseCase } from "../helpers/setup-repositories"
import { makeUser } from "../factories/user-factory"

describe('Get All Users Profiles Use Case', () => {
  let usersRepository: ReturnType<typeof setupUserRepositoryAndUseCase>['usersRepository']
  let sut: ReturnType<typeof setupUserRepositoryAndUseCase>['getUsersProfilesUseCase']

  beforeEach(() => {
    const userSetup = setupUserRepositoryAndUseCase()
    usersRepository = userSetup.usersRepository
    sut = userSetup.getUsersProfilesUseCase
  })

  it('should be able fetch all users profiles', async () => {
    // Arrange
    const user1 = await makeUser(usersRepository)
    const user2 = await makeUser(usersRepository)

    // Act
    const { users } = await sut.execute({
      page: 1
    })

    // Assert
    expect(users).toHaveLength(2)
    expect(users).toEqual([
      expect.objectContaining({ name: user1.name }),
      expect.objectContaining({ name: user2.name }),
    ])
  })

  it('should be able to fetch all paginated users profiles', async () => {
    // Arrange
    for (let i = 1; i <= 22; i++) {
      await makeUser(usersRepository, {
        name: `user-${i}`
      })
    }

    // Act
    const { users } = await sut.execute({
      page: 2
    })

    // Assert
    expect(users).toHaveLength(2)
    expect(users).toEqual([
      expect.objectContaining({ name: 'user-21' }),
      expect.objectContaining({ name: 'user-22' }),
    ])
  })
})

