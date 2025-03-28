import { Role } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'

export function verifyUserRole(roleToVerify: Role) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user as unknown as { role: string }

    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized' })
    }
  }
}
