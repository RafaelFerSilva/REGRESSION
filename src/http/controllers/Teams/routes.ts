import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../middlewares/verify-jwt'
import { getTeam } from './get_team'
import { getTeams } from './get_teams'
import { teams } from './teams'
import { updateTeams } from './update_teams'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function teamsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/teams', { onRequest: [verifyUserRole('ADMIN')] }, teams)
  app.patch(
    '/update_team',
    { onRequest: [verifyUserRole('ADMIN')] },
    updateTeams,
  )

  app.get('/team/:teamId', getTeam)
  app.get('/teams/:page', getTeams)
}
