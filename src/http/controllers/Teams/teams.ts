import { TeamAlreadyExistError } from '@/use-cases/errors/team-already-exists-error'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeCreateTeamCase } from '@/use-cases/factories/Team/make-create-team-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function teams(request: FastifyRequest, reply: FastifyReply) {
  const teamsBodySchema = z.object({
    name: z.string(),
  })

  const { name } = teamsBodySchema.parse(request.body)

  try {
    const createTeamUseCase = makeCreateTeamCase()
    const team = await createTeamUseCase.execute({
      name,
      authenticatedUserId: (request.user as unknown as { sub: string }).sub, // Usa o ID do usuário do token
    })
    return reply.status(201).send({
      message: 'Team created successfully',
      team,
    })
  } catch (error) {
    if (error instanceof UserNotFoundError)
      return reply.status(400).send({ message: error.message })
    if (error instanceof TeamAlreadyExistError)
      return reply.status(409).send({ message: error.message })
    throw error
  }
}
