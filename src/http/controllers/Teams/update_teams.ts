import { TeamAlreadyExistError } from '@/use-cases/errors/team-already-exists-error'
import { TeamNotFoundError } from '@/use-cases/errors/team-not-found-error'
import { makeUpdateTeamUseCase } from '@/use-cases/factories/Team/make-update-team-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateTeams(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateTeamsSchema = z.object({
    id: z.string().uuid(),
    name: z.string().optional(),
    active: z.boolean().optional(),
  })

  const { id, ...updateData } = updateTeamsSchema.parse(request.body)

  try {
    const updateTeamsUseCase = makeUpdateTeamUseCase()
    await updateTeamsUseCase.execute(id, updateData)
  } catch (error) {
    if (error instanceof TeamNotFoundError)
      return reply.status(400).send({ message: error.message })
    if (error instanceof TeamAlreadyExistError)
      return reply.status(409).send({ message: error.message })

    throw error
  }

  return reply.status(200).send({ message: 'Teams updated successfully' })
}
