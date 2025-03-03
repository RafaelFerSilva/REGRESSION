import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { UserAlreadyExistError } from './erros/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      rule: 'QA',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'johndoe@example.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
      rule: 'QA',
    })

    await expect(() => 
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456',
        rule: 'QA',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError)

    
  })
})