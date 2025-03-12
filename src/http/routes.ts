import { FastifyInstance } from "fastify";
import { register } from "./controllers/Users/register";
import { authenticate } from './controllers/Authenticate/authenticate'
import { teams } from "./controllers/Teams/teams";
import { getUserProfile } from "./controllers/Users/get_user_profile";
import { getTeam } from "./controllers/Teams/get_team";
import { getUsersProfiles } from "./controllers/Users/get_users_profiles";
import { getTeams } from "./controllers/Teams/get_teams";
import { getUserTeams } from "./controllers/Users/get_user_teams";
import { getUsersByRules } from "./controllers/Users/get_users_by_rule";
import { updateUser } from "./controllers/Users/update_users";
import { updateTeams } from "./controllers/Teams/update_teams";
import { profile } from "./controllers/Profile/profile";
import { verifyJWT } from "./controllers/middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.get('/user/:userId', getUserProfile)
  app.get('/users/:page', getUsersProfiles)
  app.get('/user_teams/:userId/:page', getUserTeams)
  app.get('/user_by_role/:rule/:page', getUsersByRules)
  app.patch('/update_user', updateUser)
  app.post('/sessions', authenticate)

  app.post('/teams', teams)
  app.get('/team/:teamId', getTeam)
  app.get('/teams/:page', getTeams)
  app.patch('/update_team', updateTeams)

  // Authenticated
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}