import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/User/make-get-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  try {
    const { user } = await getUserProfile.execute({
      userId: request.user?.sub,
    })

    return reply.status(200).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    })
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ message: 'User not found' })
    }
    throw error
  }
}
