import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { UserAlreadyExistError } from "@/use-cases/errors/user-already-exists-error"
import { makeRegisterUseCase } from "@/use-cases/factories/User/make-register-use-case"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    rule: z.string().optional()
  })

  const { name, email, password, rule } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()
    const { user } = await registerUseCase.execute({
      name,
      email,
      password,
      rule
    })
    return reply.status(201).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistError)
      return reply.status(409).send({ message: error.message })

    throw error
  }
}