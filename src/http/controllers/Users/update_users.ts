import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { UserNotFoundError } from "@/use-cases/errors/user-not-found-error"
import { EmailAlreadyExistError } from "@/use-cases/errors/email-already-exists-error"
import { PasswordError } from "@/use-cases/errors/password-error"
import { makeUpdateUserUseCase } from "@/use-cases/factories/User/make-update-user-use-case"

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const updateUserSchema = z.object({
    id: z.string().uuid(), 
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.string().optional(),
    active: z.boolean().optional()
  })

  const { id, ...updateData } = updateUserSchema.parse(request.body)

  try {
    const updateUserUseCase = makeUpdateUserUseCase()
    await updateUserUseCase.execute(id, updateData)
    return reply.status(200).send({ message: "User updated successfully" })
  } catch (error) {
    if (error instanceof UserNotFoundError) return reply.status(400).send({ message: error.message })
    if (error instanceof EmailAlreadyExistError) return reply.status(409).send({ message: error.message })
    if (error instanceof PasswordError) return reply.status(400).send({ message: error.message })

    throw error
  }
}
