import { Prisma, Team } from "@prisma/client";
import { TeamsRepository } from "../interfaces/teams-repository";
import { prisma } from "lib/prisma";

export class PrismaTeamsRepository implements TeamsRepository{
  
  async create(data: Prisma.TeamUncheckedCreateInput): Promise<Team> {
    const team = await prisma.team.create({ data })
    return team
  }

  async findById(id: string): Promise<Team | null> {
    const team = await prisma.team.findUnique({
      where: {
        id,
      },
    })

    return team
  }

  async findByName(name: string): Promise<Team | null> {
    const team = await prisma.team.findUnique({
      where: {
        name
      }
    })

    return team
  }

}