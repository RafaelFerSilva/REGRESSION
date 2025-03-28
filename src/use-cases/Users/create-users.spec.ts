import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateUserUseCase } from './create-users'
import { UserAlreadyExistError } from '../errors/user-already-exists-error'
import { setupUserRepositoryAndUseCase } from '../helpers/setup-repositories'
import {
  assertPasswordMatches,
  assertUserProperties,
} from '../helpers/test-assertions'
import { InvalidRoleError } from '../errors/invalid-role-error'

describe('Register Use Case', () => {
  let usersRepository: ReturnType<
    typeof setupUserRepositoryAndUseCase
  >['usersRepository']
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
      role: 'QA',
    }

    // Act
    const { user } = await sut.execute(createData)

    // Assert
    assertUserProperties(user, createData)
    await assertPasswordMatches(createData.password, user.password_hash)
  })

  it('should not be abble register a user with same email twice', async () => {
    // Arrange
    const createData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: 'QA',
    }

    // Act
    await sut.execute(createData)

    await expect(() => sut.execute(createData)).rejects.toBeInstanceOf(
      UserAlreadyExistError,
    )
  })

  it('should create user with active=true when not specified', async () => {
    const { user } = await sut.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
      role: 'USER',
    })

    expect(user.active).toBe(true)
  })

  it('should create user without specifying role', async () => {
    const { user } = await sut.execute({
      name: 'No Role User',
      email: 'norole@example.com',
      password: '123456',
    })

    expect(user.role).toBe('USER')
  })

  it('should not be able create user with invalid role', async () => {
    // Arrange
    const createData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: 'INVALID-ROLE',
    }

    await expect(() => sut.execute(createData)).rejects.toBeInstanceOf(
      InvalidRoleError,
    )
  })

  it('should hash the password before storing', async () => {
    // Esse teste verificaria se a hash está sendo gerada corretamente
    const createData = {
      name: 'Hash Test',
      email: 'hash@example.com',
      password: '123456',
    }

    const { user } = await sut.execute(createData)

    expect(user.password_hash).not.toBe(createData.password)
    await assertPasswordMatches('123456', user.password_hash)
  })

  it('should properly pass data to repository', async () => {
    // Esse teste requer um spy no método create do repositório
    const createSpy = vi.spyOn(usersRepository, 'create')

    await sut.execute({
      name: 'Repo Test',
      email: 'repo@example.com',
      password: '123456',
    })

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Repo Test',
        email: 'repo@example.com',
        password_hash: expect.any(String),
      }),
    )
  })
})
