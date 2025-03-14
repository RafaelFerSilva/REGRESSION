import { FastifyInstance } from "fastify";
import { verifyJWT } from "../middlewares/verify-jwt";
import { getTeam } from "./get_team";
import { getTeams } from "./get_teams";
import { teams } from "./teams";
import { updateTeams } from "./update_teams";

export async function teamsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/teams', teams)
  app.get('/team/:teamId', getTeam)
  app.get('/teams/:page', getTeams)
  app.patch('/update_team', updateTeams)
}