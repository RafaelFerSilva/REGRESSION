import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { UserAlreadyExistError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { UpdateUserUseCase } from './update-users'
import { randomUUID } from 'node:crypto'
import { EmailAlreadyExistError } from './errors/email-already-exists-error'

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

  it('should be able update user name', async () => {
    const newName = 'Rafael Silva'
    const { user } = await sut.execute(userToUpdate1.id, {name: newName})
    expect(user.name).toEqual(newName)
    expect(user.email).toEqual(userToUpdate1.email)
  })

  it('should be able update user e-mail', async () => {
    const newEmail = 'joao@joao.com'
    const { user } = await sut.execute(userToUpdate2.id, {email: newEmail})
    console.log(user)
    expect(user.email).toEqual(newEmail)
  })

  it('should not be able update user email to already exists email to another user', async () => {
    await expect(() =>
      sut.execute(userToUpdate2.id, {email: userToUpdate1.email}),
    ).rejects.toBeInstanceOf(EmailAlreadyExistError)
  })

  it.skip('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      rule: 'QA',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        rule: 'QA',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError)


  })
})