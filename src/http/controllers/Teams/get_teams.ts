import { TeamNotFoundError } from '@/use-cases/errors/team-not-found-error'
import { makeGetTeamsUseCase } from '@/use-cases/factories/Team/make-teams-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function getTeams(request: FastifyRequest, reply: FastifyReply) {
  const getTeamsParamsSchema = z.object({
    page: z.string(),
  })

  const { page } = getTeamsParamsSchema.parse(request.params)

  try {
    const getTeamsUseCase = makeGetTeamsUseCase()
    const { teams } = await getTeamsUseCase.execute({
      page: Number(page),
    })
    return reply.status(200).send({ teams })
  } catch (error) {
    if (error instanceof TeamNotFoundError)
      return reply.status(404).send({ message: error.message })
    throw error
  }
}
