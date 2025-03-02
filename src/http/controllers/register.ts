import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { RegisterUseCase } from "@/use-cases/register"
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository"

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
    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)
    await registerUseCase.execute({
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