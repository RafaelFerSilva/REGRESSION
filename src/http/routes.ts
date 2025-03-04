import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { authenticate } from './controllers/authenticate'
import { teams } from "./controllers/teams";
import { getUserProfile } from "./controllers/get_user_profile";
import { getTeam } from "./controllers/get_team";
import { getUsersProfiles } from "./controllers/get_users_profiles";
import { getTeams } from "./controllers/get_teams";
import { getUserTeams } from "./controllers/get_user_teams";
import { getUsersByRules } from "./controllers/get_users_by_rule";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.post('/teams', teams)
  app.get('/user/:userId', getUserProfile)
  app.get('/users/:page', getUsersProfiles)
  app.get('/team/:teamId', getTeam)
  app.get('/teams/:page', getTeams)
  app.get('/user_teams/:userId/:page', getUserTeams)
  app.get('/user_by_role/:rule/:page', getUsersByRules)
}