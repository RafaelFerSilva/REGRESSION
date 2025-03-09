import { beforeEach, describe, expect, it } from "vitest"
import { setupUserRepositoryAndUseCase } from "../helpers/setup-repositories"
import { makeUser } from "../factories/user-factory"

describe('Get Users By Rule Use Case', () => {
  let usersRepository: ReturnType<typeof setupUserRepositoryAndUseCase>['usersRepository']
  let sut: ReturnType<typeof setupUserRepositoryAndUseCase>['getUserByRuleUseCase']

  beforeEach(() => {
    const userSetup = setupUserRepositoryAndUseCase()
    usersRepository = userSetup.usersRepository
    sut = userSetup.getUserByRuleUseCase
  })

  it('should be able fetch users by user rule', async () => {
    //Arrange
    const user1 = await makeUser(usersRepository, { rule: 'QA'})
    const user2 = await makeUser(usersRepository, { rule: 'ADMIN'})
    const user3 = await makeUser(usersRepository, { rule: 'QA'})

    // Act
    const qas = await sut.execute({
      rule: 'QA'
    })

    // Assert
    expect(qas.users).toHaveLength(2)
    expect(qas.users).toEqual([
      expect.objectContaining({ name: user1.name }),
      expect.objectContaining({ name: user3.name }),
    ])

    // Act
    const admin = await sut.execute({
      rule: 'ADMIN'
    })

    // Assert
    expect(admin.users).toHaveLength(1)
    expect(admin.users).toEqual([
      expect.objectContaining({ name: user2.name })
    ])
  })

  it('should be able to fetch paginated users by rule', async () => {
    // Arrange
    for (let i = 1; i <= 22; i++) {
      await makeUser(usersRepository, { name: `user-${i}`})
    }

    // Act
    const { users } = await sut.execute({
      rule: 'QA',
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

