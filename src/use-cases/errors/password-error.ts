export class PasswordError extends Error {
  constructor() {
    super('Password must be at least 6 characters.')
  }
}