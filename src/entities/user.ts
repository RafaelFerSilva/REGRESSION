import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface UserProps {
  name: string
  email: string
  password: string
  role?: string
  active?: boolean
}

export class Users extends Entity<UserProps> {
  static create(props: UserProps, id?: UniqueEntityId) {
    const user = new Users(
      {
        ...props,
      },
      id,
    )
    return user
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get role() {
    return this.props.role
  }

  get active() {
    return this.props.active
  }
}
