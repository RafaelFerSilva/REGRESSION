import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { expect, describe, it } from "vitest";

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })

    const { user } = await sut.execute({ email: 'johndoe@example.com', password: '123456'})
    expect(user.id).toEqual(expect.any(String))
  })
})