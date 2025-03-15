import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { usersRoutes } from './http/controllers/Users/routes'
import { teamsRoutes } from './http/controllers/Teams/routes'
import { UserNotFoundError } from './use-cases/errors/user-not-found-error'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(teamsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation error', issues: error.format() })
  }

  if (error instanceof UserNotFoundError) {
    return reply.status(404).send({ message: 'User not found' })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(`ERROR!!!!!!!!!!!!: ${error}`)
  } else {
    // external log
  }

  return reply.status(500).send({ message: 'Internal server error' })
})