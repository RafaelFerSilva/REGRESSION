export class TeamAlreadyExistError extends Error {
  constructor() {
    super('Team already exists')
  }
}
