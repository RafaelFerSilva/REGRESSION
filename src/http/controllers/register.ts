import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { registerUseCase } from "@/use-cases/register"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    rule: z.string(),
    active: z.boolean()
  })

  const { name, email, password, rule, active } = registerBodySchema.parse(request.body)

  try {
    await registerUseCase({
      name,
      email, 
      password, 
      rule, 
      active
    })
  } catch( error ) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}