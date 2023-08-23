import { Types } from "mongoose";
import { LeagueModel } from "../models/league";
import { TeamModel } from "../models/team";
import { PlayerModel } from "../models/player";

class DatabaseService {
  public getAllLeagues = async () => {
    try {
      return await LeagueModel.find();
    } catch (error) {
      console.error("Error retrieving all leagues:", error);
      throw error;
    }
  };

  public getLeagueById = async (id: Types.ObjectId) => {
    try {
      return await LeagueModel.findById(id);
    } catch (error) {
      console.error("Error retrieving league by id:", error);
      throw error;
    }
  };

  public getLeagueByIds = async (ids: [Types.ObjectId]) => {
    try {
      return await LeagueModel.find({ _id: { $in: ids } });
    } catch (error) {
      console.error("Error retrieving league by ids:", error);
      throw error;
    }
  };

  public getLeagueByApiId = async (apiId: number) => {
    try {
      return await LeagueModel.findOne({ apiId });
    } catch (error) {
      console.error("Error retrieving league by apiId:", error);
      throw error;
    }
  };

  public getLeagueByName = async (name: string) => {
    try {
      return await LeagueModel.findOne({ name });
    } catch (error) {
      console.error("Error retrieving league by apiId:", error);
      throw error;
    }
  };

  public getAllTeams = async () => {
    try {
      return await TeamModel.find();
    } catch (error) {
      console.error("Error retrieving all teams:", error);
      throw error;
    }
  };

  public getTeamById = async (id: Types.ObjectId) => {
    try {
      return await TeamModel.findById(id);
    } catch (error) {
      console.error("Error retrieving team by apiId:", error);
      throw error;
    }
  };

  public getTeamByApiId = async (apiId: number) => {
    try {
      return await TeamModel.findOne({ apiId });
    } catch (error) {
      console.error("Error retrieving team by apiId:", error);
      throw error;
    }
  };

  public getTeamByName = async (name: string) => {
    try {
      return await TeamModel.findOne({ name });
    } catch (error) {
      console.error(
        `Failed to get team by name using aggregation: ${error.message}`
      );
      throw error;
    }
  };

  public getTeamsByLeagueId = async (leagueId: Types.ObjectId) => {
    try {
      return await TeamModel.find({ leagues: leagueId });
    } catch (error) {
      console.error(
        `Failed to get teams by league id using aggregation: ${error.message}`
      );
      throw error;
    }
  };


  public getAllPlayers = async () => {
    try {
      return await PlayerModel.find();
    } catch (error) {
      console.error("Error retrieving all players:", error);
      throw error;
    }
  };

  public getPlayerByApiId = async (apiId: number) => {
    try {
      return await PlayerModel.findOne({ apiId });
    } catch (error) {
      console.error("Error retrieving player by apiId:", error);
      throw error;
    }
  };

  public getPlayerByName = async (name: string) => {
    try {
      return await PlayerModel.findOne({ name });
    } catch (error) {
      console.error("Error retrieving player by apiId:", error);
      throw error;
    }
  };

  public getPlayerByLeagueCode = async (
    leagueCode: string,
    teamName?: string
  ) => {
    const match = !teamName
      ? { code: leagueCode }
      : { code: leagueCode, "teams.name": teamName };
    try {
      const pipeline = [
        {
          $match: match,
        },
        {
          $lookup: {
            from: "teams",
            localField: "_id",
            foreignField: "league",
            as: "teams",
          },
        },
        {
          $unwind: "$teams",
        },
        {
          $lookup: {
            from: "players",
            localField: "teams._id",
            foreignField: "team",
            as: "players",
          },
        },
        {
          $unwind: "$players",
        },
        {
          $replaceRoot: { newRoot: "$players" },
        },
      ];

      const players = await LeagueModel.aggregate(pipeline).exec();

      return players;
    } catch (error) {
      console.error(
        `Failed to get players by league code using aggregation: ${error.message}`
      );
      throw error;
    }
  };

  public getPlayersByTeamId = async (teamId: Types.ObjectId) => {
    try {
      return await PlayerModel.find({ team: teamId });
    } catch (error) {
      console.error(
        `Failed to get players by team id using aggregation: ${error.message}`
      );
      throw error;
    }
  };

  public updateTeamLeagues = async (
    teamId: Types.ObjectId,
    leagueId: Types.ObjectId
  ) => {
    try {
      return await TeamModel.findByIdAndUpdate(
        teamId,
        {
          $addToSet: { leagues: leagueId },
        },
        { new: true }
      );
    } catch (error) {
      console.error(
        `Failed to update team leagues using aggregation: ${error.message}`
      );
      throw error;
    }
  };

  public createLeague = async (data: {
    apiId: number;
    name: string;
    code: string;
    areaName: string;
  }) => {
    try {
      const league = new LeagueModel(data);
      return await league.save();
    } catch (error) {
      console.error("Error creating league:", error);
      throw error;
    }
  };

  public createTeam = async (data: {
    apiId: number;
    name: string;
    tla: string;
    shortName: string;
    areaName: string;
    address: string;
    leagues: [Types.ObjectId];
  }) => {
    try {
      const team = new TeamModel(data);
      return await team.save();
    } catch (error) {
      console.error("Error creating team:", error);
      throw error;
    }
  };

  public createPlayer = async (data: {
    apiId: number;
    name: string;
    position?: string;
    dateOfBirth: Date;
    nationality: string;
    team: Types.ObjectId;
  }) => {
    try {
      const player = new PlayerModel(data);
      return await player.save();
    } catch (error) {
      console.error("Error creating player:", error);
      throw error;
    }
  };
}

export { DatabaseService };
