import { Prisma, Team } from "@prisma/client";
import { TeamsRepository } from "../teams.repository";

export class InMemoryTeamsRepository implements TeamsRepository {
  public items: Team[] = []

  async create(data: Prisma.TeamCreateInput): Promise<Team> {
    const team = {
      id: 'team-1',
      name: data.name,
      created_at: new Date(),
      userId: 'user-1'
    }

    this.items.push(team)
    return team
  }

}