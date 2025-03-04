import { ResourceNotFoundError } from "@/use-cases/erros/resource-not-found-error";
import { makeGetUsersProfilesUseCase } from "@/use-cases/factories/make-get-users-profiles-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getUsersProfiles(request: FastifyRequest, reply: FastifyReply) {
  const getUsersProfilesParamsSchema  = z.object({
    page: z.string()
  })

  const { page } = getUsersProfilesParamsSchema.parse(request.params)

  try {
    const getUsersProfilesUseCase = makeGetUsersProfilesUseCase()
    const { users } = await getUsersProfilesUseCase.execute({
      page: Number(page)
    })
    return reply.status(200).send({ users });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) return reply.status(404).send({ message: error.message })

    throw error
  }
}