import { TeamNotFoundError } from '@/use-cases/errors/team-not-found-error'
import { makeGetTeamUseCase } from '@/use-cases/factories/Team/make-team-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function getTeam(request: FastifyRequest, reply: FastifyReply) {
  const getTeamProfileParamsSchema = z.object({
    teamId: z.string().uuid(),
  })

  const { teamId } = getTeamProfileParamsSchema.parse(request.params)

  try {
    const getTeamProfileUseCase = makeGetTeamUseCase()
    const { team } = await getTeamProfileUseCase.execute({
      teamId,
    })
    return reply.status(200).send({ team })
  } catch (error) {
    if (error instanceof TeamNotFoundError)
      return reply.status(404).send({ message: error.message })

    throw error
  }
}
