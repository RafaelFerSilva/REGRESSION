import { UserNotFoundError } from "@/use-cases/errors/user-not-found-error";
import { makeGetUserProfileUseCase } from "@/use-cases/factories/User/make-get-user-profile-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getUserProfile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfileParamsSchema  = z.object({
    userId: z.string().uuid()
  })

  const { userId } = getUserProfileParamsSchema .parse(request.params)

  try {
    const getUserProfileUseCase = makeGetUserProfileUseCase()
    const { user } = await getUserProfileUseCase.execute({
      userId
    })
    return reply.status(200).send({ user });
  } catch (error) {
    if (error instanceof UserNotFoundError) return reply.status(404).send({ message: error.message })

    throw error
  }
}