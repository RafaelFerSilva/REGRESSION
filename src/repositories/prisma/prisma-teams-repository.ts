import { Prisma, Team } from "@prisma/client";
import { TeamsRepository } from "../interfaces/teams-repository";
import { prisma } from "lib/prisma";

export class PrismaTeamsRepository implements TeamsRepository {


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

  async findAll(page: number) {
    const teams = await prisma.team.findMany()
    return teams.slice((page - 1) * 20, page * 20)
  }

  async findManyByUserId(userId: string, page?: number) {
    const teams = await prisma.team.findMany(
      {
        where: { userId, }
      })

    if (page) return teams.slice((page - 1) * 20, page * 20)

    return teams
  }

  async update(teamId: string, data: Partial<Prisma.TeamUncheckedCreateInput>) {
    const updatedTeam = await prisma.team.update(
      {
        where: {
          id: teamId
        },
        data: {
          name: data.name,
          active: data.active
        }
      }
    )

    return updatedTeam
  }

}