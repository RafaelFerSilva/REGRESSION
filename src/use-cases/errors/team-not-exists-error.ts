export class TeamNotExistError extends Error {
  constructor() {
    super('Team not exists')
  }
}