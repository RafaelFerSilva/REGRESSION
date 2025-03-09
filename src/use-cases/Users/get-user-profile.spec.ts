import { beforeEach, describe, expect, it } from "vitest"
import { UserNotFoundError } from "../errors/user-not-found-error"
import { setupUserRepositoryAndUseCase } from "../helpers/setup-repositories"
import { makeUser } from "../factories/User/make-user-test"
import { assertUserProperties } from "../helpers/test-assertions"

describe('Get User Profile Use Case', () => {
  let usersRepository: ReturnType<typeof setupUserRepositoryAndUseCase>['usersRepository']
  let sut: ReturnType<typeof setupUserRepositoryAndUseCase>['getUserProfileUseCase']

  beforeEach(() => {
    const userSetup = setupUserRepositoryAndUseCase()
    usersRepository = userSetup.usersRepository
    sut = userSetup.getUserProfileUseCase
  })

  it('should be able get user profile', async () => {
    // Arrange
    const createdUser = await makeUser(usersRepository)

    // Act
    const { user } = await sut.execute({
      userId: createdUser.id
    })

    // Assert
    assertUserProperties(user, createdUser)
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})

