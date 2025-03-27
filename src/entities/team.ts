import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface TeamProps {
  name: string
  userId: UniqueEntityId
}

export class Teams extends Entity<TeamProps> {
  static create(props: TeamProps, userId?: UniqueEntityId) {
    const team = new Teams(
      {
        ...props,
      },
      userId,
    )
    return team
  }

  get name() {
    return this.props.name
  }

  get userId() {
    return this.props.userId
  }
}
