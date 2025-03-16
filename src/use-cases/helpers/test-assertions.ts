import { expect } from 'vitest'
import { Team, User } from '@prisma/client'
import { compare } from 'bcryptjs'

export function assertUserProperties(
  user: User,
  expected: {
    name?: string
    email?: string
    role?: string
    active?: boolean
  }
) {
  if (expected.name) {
    expect(user.name).toEqual(expected.name)
  }
  if (expected.email) {
    expect(user.email).toEqual(expected.email)
  }
  if (expected.role) {
    expect(user.role).toEqual(expected.role)
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

export function assertTeamProperties(
  team: Team | null,
  expected: {
    name?: string;
    active?: boolean;
    id?: string;
    created_at?: Date;
    updated_at?: Date;
    userId?: string;
  }
) {
  if (expected.name) {
    expect(team?.name).toEqual(expected.name)
  }
  if (expected.active !== undefined) {
    expect(team?.active).toEqual(expected.active)
  }
  if (expected.id) {
    expect(team?.id).toEqual(expected.id)
  }
  if (expected.created_at) {
    expect(team?.created_at).toEqual(new Date(expected.created_at))
  }
  if (expected.updated_at) {
    expect(team?.updated_at).toEqual(new Date(expected.updated_at))
  }
  if (expected.userId) {
    expect(team?.userId).toEqual(expected.userId)
  }
}
