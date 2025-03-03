import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { RegisterUseCase } from "@/use-cases/register"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { UserAlreadyExistError } from "@/use-cases/erros/user-already-exists-error"
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    rule: z.string()
  })

  const { name, email, password, rule} = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()
    await registerUseCase.execute({
      name,
      email,
      password,
      rule,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistError)
      return reply.status(409).send({ message: error.message })

    throw error
  }

  return reply.status(201).send()
}