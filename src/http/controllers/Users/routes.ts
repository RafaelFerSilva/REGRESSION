import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { verifyJWT } from "../middlewares/verify-jwt";
import { getUserProfile } from "./get_user_profile";
import { getUserTeams } from "./get_user_teams";
import { getUsersByRules } from "./get_users_by_rule";
import { getUsersProfiles } from "./get_users_profiles";
import { updateUser } from "./update_users";
import { profile } from "./profile";
import { refresh } from "./refresh";

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.get('/user/:userId', { onRequest: [verifyJWT] }, getUserProfile)
  app.get('/users/:page', { onRequest: [verifyJWT] }, getUsersProfiles)
  app.get('/user_teams/:userId/:page', { onRequest: [verifyJWT] }, getUserTeams)
  app.get('/user_by_role/:rule/:page', { onRequest: [verifyJWT] }, getUsersByRules)
  app.patch('/update_user', { onRequest: [verifyJWT] }, updateUser)

  app.patch('/token/refresh', refresh)
  

  // Authenticated
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}