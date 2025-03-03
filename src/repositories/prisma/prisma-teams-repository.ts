import { Prisma, Team } from "@prisma/client";
import { TeamsRepository } from "../teams.repository";
import { prisma } from "lib/prisma";

export class PrismaTeamsRepository implements TeamsRepository{
  async create(data: Prisma.TeamCreateInput): Promise<Team> {
    const team = await prisma.team.create({ data })
    return team
  }

}