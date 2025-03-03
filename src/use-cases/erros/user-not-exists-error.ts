export class UserNotExistError extends Error {
  constructor() {
    super('User not exists')
  }
}