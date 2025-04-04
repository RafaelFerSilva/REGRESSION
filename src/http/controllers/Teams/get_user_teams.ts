import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeGetUserTeamsUseCase } from '@/use-cases/factories/User/make-user-teams-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function getUserTeams(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserTeamsParamsSchema = z.object({
    userId: z.string(),
    page: z.string(),
  })

  const { userId, page } = getUserTeamsParamsSchema.parse(request.params)

  try {
    const getUserTeamsUseCase = makeGetUserTeamsUseCase()
    const { teams } = await getUserTeamsUseCase.execute({
      userId,
      page: Number(page),
    })
    return reply.status(200).send({ teams })
  } catch (error) {
    if (error instanceof UserNotFoundError)
      return reply.status(404).send({ message: error.message })

    throw error
  }
}
