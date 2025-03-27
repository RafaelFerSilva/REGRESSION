import { beforeEach, describe, expect, it } from 'vitest'
import { setupUserRepositoryAndUseCase } from '../helpers/setup-repositories'
import { makeUser } from '../factories/User/make-user-test'

describe('Get Users By Role Use Case', () => {
  let usersRepository: ReturnType<
    typeof setupUserRepositoryAndUseCase
  >['usersRepository']
  let sut: ReturnType<
    typeof setupUserRepositoryAndUseCase
  >['getUserByRoleUseCase']

  beforeEach(() => {
    const userSetup = setupUserRepositoryAndUseCase()
    usersRepository = userSetup.usersRepository
    sut = userSetup.getUserByRoleUseCase
  })

  it('should be able fetch users by user role', async () => {
    // Arrange
    const user1 = await makeUser(usersRepository, { role: 'QA' })
    const user2 = await makeUser(usersRepository, { role: 'ADMIN' })
    const user3 = await makeUser(usersRepository, { role: 'QA' })

    // Act
    const qas = await sut.execute({
      role: 'QA',
    })

    // Assert
    expect(qas.users).toHaveLength(2)
    expect(qas.users).toEqual([
      expect.objectContaining({ name: user1.name }),
      expect.objectContaining({ name: user3.name }),
    ])

    // Act
    const admin = await sut.execute({
      role: 'ADMIN',
    })

    // Assert
    expect(admin.users).toHaveLength(1)
    expect(admin.users).toEqual([expect.objectContaining({ name: user2.name })])
  })

  it('should be able to fetch paginated users by role', async () => {
    // Arrange
    for (let i = 1; i <= 22; i++) {
      await makeUser(usersRepository, { name: `user-${i}` })
    }

    // Act
    const { users } = await sut.execute({
      role: 'USER',
      page: 2,
    })

    // Assert
    expect(users).toHaveLength(2)
    expect(users).toEqual([
      expect.objectContaining({ name: 'user-21' }),
      expect.objectContaining({ name: 'user-22' }),
    ])
  })
})
