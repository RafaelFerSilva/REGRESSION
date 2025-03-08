export class EmailAlreadyExistError extends Error {
  constructor() {
    super('E-mail already exists.')
  }
}