import { ResourceNotFoundError } from "@/use-cases/erros/resource-not-found-error";
import { makeGetUsersByRulesUseCase } from "@/use-cases/factories/make-get-users-by-rule-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getUsersByRules(request: FastifyRequest, reply: FastifyReply) {
  const getUsersByRulesParamsSchema  = z.object({
    rule: z.string(),
    page: z.string()
  })

  const {rule, page } = getUsersByRulesParamsSchema.parse(request.params)

  try {
    const getUsersByRulesUseCase = makeGetUsersByRulesUseCase()
    const { users } = await getUsersByRulesUseCase.execute({
      rule: rule,
      page: Number(page)
    })
    return reply.status(200).send({ users });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) return reply.status(404).send({ message: error.message })

    throw error
  }
}