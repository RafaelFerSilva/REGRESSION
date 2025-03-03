import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUseCase({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async findByEmail(email: string) {
        return null
      },
      async create(data: any) {
        return {
          id: 'user-1',
          name: data.name,
          email:data.email,
          password_hash:data.password_hash,
          rule: data.rule,
          active: data.active,
          created_at: new Date()
        }
      }
    })

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      rule: 'QA',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)
    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})