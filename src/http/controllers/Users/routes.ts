import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { verifyJWT } from '../middlewares/verify-jwt'
import { getUserProfile } from './get_user_profile'
import { getUserTeams } from '../Teams/get_user_teams'
import { getUsersByRoles } from './get_users_by_role'
import { getUsersProfiles } from './get_users_profiles'
import { updateUser } from './update_users'
import { profile } from './profile'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.get('/user/:userId', { onRequest: [verifyJWT] }, getUserProfile)
  app.get('/users/:page', { onRequest: [verifyJWT] }, getUsersProfiles)
  app.get('/user_teams/:userId/:page', { onRequest: [verifyJWT] }, getUserTeams)
  app.get(
    '/user_by_role/:role/:page',
    { onRequest: [verifyJWT] },
    getUsersByRoles,
  )
  app.patch('/update_user', { onRequest: [verifyJWT] }, updateUser)

  app.patch('/token/refresh', refresh)

  // Authenticated
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
