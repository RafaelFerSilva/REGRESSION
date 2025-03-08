import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { User } from '@prisma/client'
import { compare, hash } from 'bcryptjs'
import { UpdateUserUseCase } from './update-users'
import { randomUUID } from 'node:crypto'
import { EmailAlreadyExistError } from './errors/email-already-exists-error'
import { PasswordError } from './errors/password-error'
import { UserNotFoundError } from './errors/user-not-found-error'

describe('Update User Use Case', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: UpdateUserUseCase
  let userToUpdate1: User
  let userToUpdate2: User

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(usersRepository)

    userToUpdate1 = await usersRepository.create({
      id: randomUUID(),
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })

    userToUpdate2 = await usersRepository.create({
      id: randomUUID(),
      name: 'João da Silva',
      email: 'joao@silva.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })
  })

  it('should be able to update all user data', async () => {
    // Arrange
    const updateData = {
      name: 'Update user',
      email: 'update@example.com',
      password: '12345987',
      rule: 'ADMIN',
      active: false
    }
    
    // Act
    const { user } = await sut.execute(userToUpdate1.id, updateData)
    
    // Assert
    expect(user.name).toEqual(updateData.name)
    expect(user.email).toEqual(updateData.email)
    expect(user.rule).toEqual(updateData.rule)
    expect(user.active).toEqual(updateData.active)

    const doesPasswordMatches = await compare(updateData.password, user.password_hash)
    expect(doesPasswordMatches).toBeTruthy()
  })

  it('should return the same user if no data to update is provided', async () => {
    // Arrange
    const userTest = await usersRepository.create({
      id: randomUUID(),
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })
    
    // Act
    const { user } = await sut.execute(userTest.id, userTest)
    
    // Assert
    expect(user.name).toEqual(userTest.name)
    expect(user.email).toEqual(userTest.email)
    expect(user.rule).toEqual(userTest.rule)
    expect(user.active).toEqual(userTest.active)
    expect(userTest.password_hash).toEqual(user.password_hash)
  })

  it('should not be able to update a non-existing user', async () => {
    // Arrange
    const updateData = {
      name: 'Update user',
      email: 'update@example.com',
      password: '12345987',
      rule: 'ADMIN',
      active: false
    }
    const nonExistingId = 'non-existing-user'
    
    // Act & Assert
    await expect(() =>
      sut.execute(nonExistingId, updateData),
    ).rejects.toBeInstanceOf(UserNotFoundError)
    
    // Verificando a mensagem de erro específica
    await expect(() =>
      sut.execute(nonExistingId, updateData),
    ).rejects.toThrowError('User not found')
  })

  it('should be able to update only the user name', async () => {
    // Arrange
    const newName = 'Rafael Silva'
    const originalEmail = userToUpdate1.email
    const originalRule = userToUpdate1.rule
    const originalActive = userToUpdate1.active
    
    // Act
    const { user } = await sut.execute(userToUpdate1.id, { name: newName })
    
    // Assert
    expect(user.name).toEqual(newName)
    expect(user.email).toEqual(originalEmail)
    expect(user.rule).toEqual(originalRule)
    expect(user.active).toEqual(originalActive)
  })

  it('should be able to update only the user email', async () => {
    // Arrange
    const newEmail = 'joaosilva@silva.com'
    const originalName = userToUpdate2.name
    const originalRule = userToUpdate2.rule
    const originalActive = userToUpdate2.active
    
    // Act
    const { user } = await sut.execute(userToUpdate2.id, { email: newEmail })
    
    // Assert
    expect(user.email).toEqual(newEmail)
    expect(user.name).toEqual(originalName)
    expect(user.rule).toEqual(originalRule)
    expect(user.active).toEqual(originalActive)
  })

  it('should not be able to update user email to an email that already exists', async () => {
    // Arrange
    const existingEmail = userToUpdate1.email
    
    // Act & Assert
    await expect(() =>
      sut.execute(userToUpdate2.id, { email: existingEmail }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistError)
    
    // Verificando a mensagem de erro específica
    await expect(() =>
      sut.execute(userToUpdate2.id, { email: existingEmail }),
    ).rejects.toThrowError('E-mail already exists.')
  })

  it('should be able to update only the user password', async () => {
    // Arrange
    const newPassword = '123457'
    const originalEmail = userToUpdate1.email
    const originalName = userToUpdate1.name
    const originalRule = userToUpdate1.rule
    const originalActive = userToUpdate1.active
    
    // Act
    const { user } = await sut.execute(userToUpdate1.id, { password: newPassword })
    
    // Assert
    const doesPasswordMatches = await compare(newPassword, user.password_hash)
    expect(doesPasswordMatches).toBeTruthy()
    expect(user.email).toEqual(originalEmail)
    expect(user.name).toEqual(originalName)
    expect(user.rule).toEqual(originalRule)
    expect(user.active).toEqual(originalActive)
  })

  it('should not be able to update password with less than 6 characters', async () => {
    // Arrange
    const shortPassword = '12345'
    
    // Act & Assert
    await expect(() =>
      sut.execute(userToUpdate1.id, { password: shortPassword }),
    ).rejects.toBeInstanceOf(PasswordError)
    
    // Verificando a mensagem de erro específica
    await expect(() =>
      sut.execute(userToUpdate1.id, { password: shortPassword }),
    ).rejects.toThrowError('Password must be at least 6 characters.')
  })

  it('should be able to update only the user rule', async () => {
    // Arrange
    const newRule = 'ADMIN'
    const originalEmail = userToUpdate1.email
    const originalName = userToUpdate1.name
    const originalActive = userToUpdate1.active
    
    // Act
    const { user } = await sut.execute(userToUpdate1.id, { rule: newRule })
    
    // Assert
    expect(user.rule).toEqual(newRule)
    expect(user.email).toEqual(originalEmail)
    expect(user.name).toEqual(originalName)
    expect(user.active).toEqual(originalActive)
  })

  it('should be able to update only the user active status', async () => {
    // Arrange
    const originalEmail = userToUpdate1.email
    const originalName = userToUpdate1.name
    const originalRule = userToUpdate1.rule
    
    // Act - Desativando o usuário
    const result1 = await sut.execute(userToUpdate1.id, { active: false })
    
    // Assert
    expect(result1.user.active).toBe(false)
    expect(result1.user.email).toEqual(originalEmail)
    expect(result1.user.name).toEqual(originalName)
    expect(result1.user.rule).toEqual(originalRule)
    
    // Act - Reativando o usuário
    const result2 = await sut.execute(userToUpdate1.id, { active: true })
    
    // Assert
    expect(result2.user.active).toBe(true)
    expect(result2.user.email).toEqual(originalEmail)
    expect(result2.user.name).toEqual(originalName)
    expect(result2.user.rule).toEqual(originalRule)
  })

  it('should validate user id before updating', async () => {
    // Arrange
    const findByIdSpy = vi.spyOn(usersRepository, 'findById')
    const updateData = { name: 'New Name' }
    
    // Act
    await sut.execute(userToUpdate1.id, updateData)
    
    // Assert
    expect(findByIdSpy).toHaveBeenCalledWith(userToUpdate1.id)
  })

  it('should check for email duplicates when updating email', async () => {
    // Arrange
    const findByEmailSpy = vi.spyOn(usersRepository, 'findbyEmail')
    const newEmail = 'new@example.com'
    
    // Act
    await sut.execute(userToUpdate1.id, { email: newEmail })
    
    // Assert
    expect(findByEmailSpy).toHaveBeenCalledWith(newEmail)
  })
})