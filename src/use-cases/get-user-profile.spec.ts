import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-user-repository"
import { GetUserProfileUseCase } from "./get-user-profile"
import { beforeEach, describe, expect, it } from "vitest"
import { hash } from "bcryptjs"
import { UserNotFoundError } from "./errors/user-not-found-error"

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      rule: 'QA',
      active: true
    })

    const { user } = await sut.execute({
      userId: createdUser.id
    })

    expect(user.name).toEqual(createdUser.name)
    expect(user.email).toEqual(createdUser.email)
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})

