import { randomUUID } from 'node:crypto'

interface MakeTeamsParams {
  name?: string
  userId?: string
}

interface MakeTeamsResponse {
  name: string
  userId?: string
}

export function makeTeamData(
  override: MakeTeamsParams = {},
): MakeTeamsResponse {
  const team = {
    name: override.name || 'John Doe',
    userId: override.userId || randomUUID(),
  }

  return team
}
