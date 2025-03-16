import { makeUserData } from '@/use-cases/factories/User/make-user-data-test'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const newUser = makeUserData()
  const userResponse = await request(app.server).post('/users').send({
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
    role: newUser.role,
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: newUser.email,
    password: newUser.password,
  })

  const { user } = userResponse.body
  const { token } = authResponse.body

  return {
    user,
    token,
  }
}
