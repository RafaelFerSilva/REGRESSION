import { makeGetUsersByRolesUseCase } from '@/use-cases/factories/User/make-get-users-by-role-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function getUsersByRoles(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUsersByRolesParamsSchema = z.object({
    role: z.string(),
    page: z.string(),
  })

  const { role, page } = getUsersByRolesParamsSchema.parse(request.params)

  const getUsersByRolesUseCase = makeGetUsersByRolesUseCase()
  const { users } = await getUsersByRolesUseCase.execute({
    role,
    page: Number(page),
  })
  return reply.status(200).send({ users })
}
