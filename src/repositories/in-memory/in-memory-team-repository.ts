import { Prisma, Team } from "@prisma/client";
import { TeamsRepository } from "../interfaces/teams-repository";

export class InMemoryTeamsRepository implements TeamsRepository {
  
  public items: Team[] = []

  async create(data: Prisma.TeamUncheckedCreateInput): Promise<Team> {
    const team = {
      id: 'team-1',
      name: data.name,
      created_at: new Date(),
      userId: 'user-1'
    }

    this.items.push(team)
    return team
  }

  async findById(id: string): Promise<Team | null> {
    const team = this.items.find((item) => item.id == id)

    if(!team) {
      return null
    }

    return team
  }

  async findByName(name: string): Promise<Team | null> {
    const team = this.items.find((item) => item.name == name)

    if(!team) {
      return null
    }

    return team
  }

  async findAll(page: number) {
    return this.items.slice((page - 1) * 20, page * 20)
  }

}