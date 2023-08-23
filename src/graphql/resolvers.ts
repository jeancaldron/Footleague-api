import { Types } from "mongoose";
import { DatabaseService } from "../services/databaseService";
import { ImportLeagueService } from "../services/importLeagueService";

const databaseService = new DatabaseService();
const importLeagueService = new ImportLeagueService();

const resolvers = {
  Query: {
    team: async (_: unknown, { name }: { name: string }) => {
      return await databaseService.getTeamByName(name);
    },
    player: async (_: unknown, { name }: { name: string }) => {
      return await databaseService.getPlayerByName(name);
    },
    players: async (
      _: unknown,
      { leagueCode, teamName }: { leagueCode: string; teamName?: string }
    ) => {
      if (teamName) {
        return await databaseService.getPlayerByLeagueCode(
          leagueCode,
          teamName
        );
      }
      return await databaseService.getPlayerByLeagueCode(leagueCode);
    },
    league: async (_: unknown, { name }: { name: string }) => {
      return await databaseService.getLeagueByName(name);
    },
    allPlayers: async () => {
      return await databaseService.getAllPlayers();
    },
    allTeams: async () => {
      return await databaseService.getAllTeams();
    },
    allLeagues: async () => {
      return await databaseService.getAllLeagues();
    }
  },
  Mutation: {
    importLeague: async (
      _: unknown,
      { leagueCode }: { leagueCode: string }
    ) => {
      return await importLeagueService.importLeague(leagueCode);
    },
  },
  League: {
    Teams: async (parent: { _id: Types.ObjectId }) => {
      return await databaseService.getTeamsByLeagueId(parent._id);
    }
  },
  Team: {
    leagues: async (parent: { leagues: [Types.ObjectId] }) => {
      return await databaseService.getLeagueByIds(parent.leagues);
    },
    Players: async (parent: { _id: Types.ObjectId }) => {
      return await databaseService.getPlayersByTeamId(parent._id);
    },
  },
  Player: {
    team: async (parent: { team: Types.ObjectId }) => {
      return await databaseService.getTeamById(parent.team);
    },
  },
};

export { resolvers };
