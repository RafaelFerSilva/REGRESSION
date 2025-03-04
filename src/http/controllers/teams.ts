import { TeamAlreadyExistError } from "@/use-cases/errors/team-already-exists-error";
import { UserNotExistError } from "@/use-cases/errors/user-not-exists-error";
import { makeCreateTeamCase } from "@/use-cases/factories/make-create-team-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function teams(request: FastifyRequest, reply: FastifyReply) {
  const teamsBodySchema = z.object({
    name: z.string(),
    userId: z.string().uuid()
  })

  const { name, userId } = teamsBodySchema.parse(request.body)

  try {
    const createTeamUseCase = makeCreateTeamCase()
    await createTeamUseCase.execute({
      name,
      userId
    })
  } catch (error) {
    if (error instanceof UserNotExistError) return reply.status(400).send({ message: error.message })
    if (error instanceof TeamAlreadyExistError) return reply.status(409).send({ message: error.message })
    throw error
  }
  return reply.status(201).send()
}