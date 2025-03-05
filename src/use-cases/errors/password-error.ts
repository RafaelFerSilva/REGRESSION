export class PasswordError extends Error {
  constructor() {
    super('Password Error: Check password rules')
  }
}