import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma, setUserContext } from '../../lib/prisma';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      [key: string]: any;
    };
  }
}

export async function auditMiddleware(
  fastify: FastifyInstance
) {
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user?.id;
    setUserContext(prisma, userId);
  });
}