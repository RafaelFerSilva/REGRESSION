import { prisma } from "lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { hash } from 'bcryptjs'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    rule: z.string(),
    active: z.boolean()
  })

  const { name, email, password, rule, active } = registerBodySchema.parse(request.body)

  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (userWithSameEmail) {
    return reply.status(409).send()
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
      rule,
      active
    }
  })

  return reply.status(201).send()
}