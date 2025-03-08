import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { User } from '@prisma/client'
import { compare, hash } from 'bcryptjs'
import { UpdateUserUseCase } from './update-users'
import { randomUUID } from 'node:crypto'
import { EmailAlreadyExistError } from './errors/email-already-exists-error'
import { PasswordError } from './errors/password-error'
import { UserNotExistError } from './errors/user-not-exists-error'

let usersRepository: InMemoryUsersRepository
let userToUpdate1: User
let userToUpdate2: User
let sut: UpdateUserUseCase


describe('Update User Use Case', () => {
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


  it('should be able update user data', async () => {
    const userToUpdate = {
      name: 'Update user',
      email: 'update@example.com',
      password: '12345987',
      rule: 'ADMIN',
      active: false
    }

    const { user } = await sut.execute(userToUpdate1.id, userToUpdate)
    expect(user.name).toEqual(userToUpdate.name)
    expect(user.email).toEqual(userToUpdate.email)
    expect(user.rule).toEqual(userToUpdate.rule)
    expect(user.active).toEqual(userToUpdate.active)

    const doesPasswordMatches = await compare(userToUpdate.password, user.password_hash)
    expect(doesPasswordMatches).toBeTruthy()
  })

  it('should be return same user if no data to update', async () => {
    const userTest = await usersRepository.create({
      id: randomUUID(),
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })
    const { user } = await sut.execute(userTest.id, userTest)
    expect(user.name).toEqual(userTest.name)
    expect(user.email).toEqual(userTest.email)
    expect(user.rule).toEqual(userTest.rule)
    expect(user.active).toEqual(userTest.active)
    expect(userTest.password_hash).toEqual(user.password_hash)
  })

  it('should not be able update non existing user', async () => {
    const userToUpdate = {
      name: 'Update user',
      email: 'update@example.com',
      password: '12345987',
      rule: 'ADMIN',
      active: false
    }

    await expect(() =>
      sut.execute('non-existing-user', userToUpdate),
    ).rejects.toBeInstanceOf(UserNotExistError)
  })

  it('should be able update user name', async () => {
    const newName = 'Rafael Silva'
    const { user } = await sut.execute(userToUpdate1.id, { name: newName })
    expect(user.name).toEqual(newName)
    expect(user.email).toEqual(userToUpdate1.email)
  })

  it('should be able update user e-mail', async () => {
    const newEmail = 'joaosilva@silva.com'
    const { user } = await sut.execute(userToUpdate2.id, { email: newEmail })
    expect(user.email).toEqual(newEmail)
  })

  it('should not be able update user email to already exists email to another user', async () => {
    await expect(() =>
      sut.execute(userToUpdate2.id, { email: userToUpdate1.email }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistError)
  })

  it('should be able update user password', async () => {
    const newPassword = '123457'
    const { user } = await sut.execute(userToUpdate1.id, { password: newPassword })
    const doesPasswordMatches = await compare(newPassword, user.password_hash)
    expect(doesPasswordMatches).toBeTruthy()
    expect(user.email).toEqual(userToUpdate1.email)
  })

  it('should not be able update password with less more than 6 digits', async () => {
    await expect(() =>
      sut.execute(userToUpdate1.id, { password: '12345' }),
    ).rejects.toBeInstanceOf(PasswordError)
  })

  it('should be able update user Rule', async () => {
    const { user } = await sut.execute(userToUpdate1.id, { rule: 'ADMIN' })
    expect(user.rule).toEqual('ADMIN')
  })

  it('should be able update user active status', async () => {
    let user = await sut.execute(userToUpdate1.id, { active: false })
    expect(user.user.active).toBe(false)

    user = await sut.execute(userToUpdate1.id, { active: true })
    expect(user.user.active).toBe(true)
  })
})