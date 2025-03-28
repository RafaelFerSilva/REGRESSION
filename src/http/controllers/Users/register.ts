import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/User/make-register-use-case'
import { InvalidRoleError } from '@/use-cases/errors/invalid-role-error'
import { Role } from '@prisma/client'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z
    .object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      role: z
        .string()
        .optional()
        .refine(
          (value) =>
            value === undefined || Object.values(Role).includes(value as Role),
          { message: 'Invalid Role Error' },
        ),
    })
    .transform((data) => {
      // Se role for undefined, retorna o objeto original
      if (data.role === undefined) return data

      // Se role for inválida, lança um erro com a mensagem personalizada
      if (!Object.values(Role).includes(data.role as Role)) {
        throw new z.ZodError([
          {
            code: 'custom',
            message: 'Invalid Role Error',
            path: ['role'],
          },
        ])
      }

      return data
    })

  const { name, email, password, role } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()
    const { user } = await registerUseCase.execute({
      name,
      email,
      password,
      role,
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

    if (error instanceof InvalidRoleError)
      return reply.status(400).send({ message: error.message })

    throw error
  }
}
