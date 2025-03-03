import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { authenticate } from './controllers/authenticate'
import { teams } from "./controllers/teams";

export async function appRoutes(app:FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.post('/teams', teams)
}