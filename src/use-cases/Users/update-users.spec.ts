import { beforeEach, describe, expect, it, vi } from 'vitest'
import { User } from '@prisma/client'
import { UpdateUserUseCase } from './update-users'
import { EmailAlreadyExistError } from '../errors/email-already-exists-error'
import { PasswordError } from '../errors/password-error'
import { UserNotFoundError } from '../errors/user-not-found-error'


// Importar as factories e helpers
import { makeUser } from '@/use-cases/factories/User/make-user-test'
import { assertUserProperties, assertPasswordMatches } from '@/use-cases/helpers/test-assertions'
import { setupUserRepositoryAndUseCase } from '@/use-cases/helpers/setup-repositories'

describe('Update User Use Case', () => {
  let usersRepository: ReturnType<typeof setupUserRepositoryAndUseCase>['usersRepository']
  let sut: UpdateUserUseCase
  let userToUpdate1: User
  let userToUpdate2: User

  beforeEach(async () => {
    // Usar o helper para configurar o repositório e caso de uso
    const setup = setupUserRepositoryAndUseCase()
    usersRepository = setup.usersRepository
    sut = setup.updateUserUseCase

    // Criar usuários de teste usando a factory
    userToUpdate1 = await makeUser(usersRepository)
    userToUpdate2 = await makeUser(usersRepository, {
      name: 'João da Silva',
      email: 'joao@silva.com'
    })
  })

  it('should be able to update all user data', async () => {
    // Arrange
    const updateData = {
      name: 'Update user',
      email: 'update@example.com',
      password: '12345987',
      role: 'ADMIN',
      active: false
    }
    
    // Act
    const { user } = await sut.execute(userToUpdate1.id, updateData)
    
    // Assert - usando o helper para verificar propriedades
    assertUserProperties(user, updateData)
    await assertPasswordMatches(updateData.password, user.password_hash)
  })

  it('should return the same user if no data to update is provided', async () => {
    // Arrange
    const userTest = await makeUser(usersRepository)
    
    // Act
    const { user } = await sut.execute(userTest.id, userTest)
    
    // Assert - usando o helper para verificar propriedades
    assertUserProperties(user, {
      name: userTest.name,
      email: userTest.email,
      role: userTest.role,
      active: userTest.active
    })
    expect(userTest.password_hash).toEqual(user.password_hash)
  })

  it('should not be able to update a non-existing user', async () => {
    // Arrange
    const updateData = {
      name: 'Update user',
      email: 'update@example.com'
    }
    const nonExistingId = 'non-existing-user'
    
    // Act & Assert
    await expect(() =>
      sut.execute(nonExistingId, updateData),
    ).rejects.toBeInstanceOf(UserNotFoundError)
    
    // Verificando a mensagem de erro específica
    await expect(() =>
      sut.execute(nonExistingId, updateData),
    ).rejects.toThrowError('User not found.')
  })

  it('should be able to update only the user name', async () => {
    // Arrange
    const newName = 'Rafael Silva'
    
    // Act
    const { user } = await sut.execute(userToUpdate1.id, { name: newName })
    
    // Assert
    assertUserProperties(user, {
      name: newName,
      email: userToUpdate1.email,
      role: userToUpdate1.role,
      active: userToUpdate1.active
    })
  })

  it('should be able to update only the user email', async () => {
    // Arrange
    const newEmail = 'joaosilva@silva.com'
    
    // Act
    const { user } = await sut.execute(userToUpdate2.id, { email: newEmail })

    // Assert
    assertUserProperties(user, {
      name: userToUpdate2.name,
      email: userToUpdate2.email,
      role: userToUpdate2.role,
      active: userToUpdate2.active
    })
  })

  it('should not be able to update user email to an email that already exists', async () => {
    // Arrange
    const existingEmail = userToUpdate1.email
    
    // Act & Assert
    await expect(() =>
      sut.execute(userToUpdate2.id, { email: existingEmail }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistError)
  })

  it('should be able to update only the user password', async () => {
    // Arrange
    const newPassword = '123457'
    
    // Act
    const { user } = await sut.execute(userToUpdate2.id, { password: newPassword })

    // Assert
    assertUserProperties(user, {
      name: userToUpdate2.name,
      email: userToUpdate2.email,
      role: userToUpdate2.role,
      active: userToUpdate2.active
    })
    await assertPasswordMatches(newPassword, user.password_hash)
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

  it('should be able to update only the user role', async () => {

    // Arrange
    const newRole = 'ADMIN'
    
    // Act
    const { user } = await sut.execute(userToUpdate2.id, { role: newRole })

    // Assert
    assertUserProperties(user, {
      name: userToUpdate2.name,
      email: userToUpdate2.email,
      role: newRole,
      active: userToUpdate2.active
    })
  })

  it('should be able to update only the user active status', async () => {
      // Act - Desativando o usuário
    const result1 = await sut.execute(userToUpdate1.id, { active: false })
 
     // Assert
     assertUserProperties(result1.user, {
       name: userToUpdate1.name,
       email: userToUpdate1.email,
       role: userToUpdate1.role,
       active: false
     })

    // Act - Reativando o usuário
    const result2 = await sut.execute(userToUpdate1.id, { active: true })

     // Assert
     assertUserProperties(result2.user, {
      name: userToUpdate1.name,
      email: userToUpdate1.email,
      role: userToUpdate1.role,
      active: true
    })
    
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