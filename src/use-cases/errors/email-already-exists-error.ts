export class EmailAlreadyExistError extends Error {
  constructor() {
    super('Email already exist error')
  }
}