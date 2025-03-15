import { makeGetUsersProfilesUseCase } from "@/use-cases/factories/User/make-get-users-profiles-use-case";
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

    throw error
  }
}