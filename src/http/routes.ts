import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { authenticate } from './controllers/authenticate'
import { teams } from "./controllers/teams";
import { getUserProfile } from "./controllers/get_user_profile";
import { getTeam } from "./controllers/get_team";
import { getUsersProfiles } from "./controllers/get_users_profiles";

export async function appRoutes(app:FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.post('/teams', teams)
  app.get('/user/:userId', getUserProfile)
  app.get('/users/:page', getUsersProfiles)
  app.get('/team/:teamId', getTeam)
}