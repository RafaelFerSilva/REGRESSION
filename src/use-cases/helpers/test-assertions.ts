import { expect } from 'vitest'
import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

export function assertUserProperties(
  user: User,
  expected: {
    name?: string
    email?: string
    rule?: string
    active?: boolean
  }
) {
  if (expected.name) {
    expect(user.name).toEqual(expected.name)
  }
  if (expected.email) {
    expect(user.email).toEqual(expected.email)
  }
  if (expected.rule) {
    expect(user.rule).toEqual(expected.rule)
  }
  if (expected.active !== undefined) {
    expect(user.active).toEqual(expected.active)
  }
}

export async function assertPasswordMatches(
  plainTextPassword: string,
  passwordHash: string
): Promise<void> {
  const doesPasswordMatch = await compare(plainTextPassword, passwordHash)
  expect(doesPasswordMatch).toBeTruthy()
}