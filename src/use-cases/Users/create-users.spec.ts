import { beforeEach, describe, expect, it } from 'vitest'
import { CreateUserUseCase } from './create-users'
import { UserAlreadyExistError } from '../errors/user-already-exists-error'
import { setupUserRepositoryAndUseCase } from '../helpers/setup-repositories'
import { assertPasswordMatches, assertUserProperties } from '../helpers/test-assertions'

describe('Register Use Case', () => {
  let usersRepository: ReturnType<typeof setupUserRepositoryAndUseCase>['usersRepository']
  let sut: CreateUserUseCase

  beforeEach(() => {
    const setup = setupUserRepositoryAndUseCase()
    usersRepository = setup.usersRepository
    sut = setup.createUserUseCase
  })

  it('should be able to register', async () => {
    // Arrange
    const createData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      rule: 'QA',
    }

    // Act
    const { user } = await sut.execute(createData)

    // Assert
    assertUserProperties(user, createData)
    await assertPasswordMatches(createData.password, user.password_hash)
  })

  it('should hash user password upon registration', async () => {
    // Arrange
    const createData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      rule: 'QA',
    }

    // Act
    await sut.execute(createData)

    await expect(() =>
      sut.execute(createData),
    ).rejects.toBeInstanceOf(UserAlreadyExistError)
  })

  it('should create user with active=true when not specified', async () => {
    const { user } = await sut.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
      rule: 'USER'
    });
    
    expect(user.active).toBe(true);
  });
})