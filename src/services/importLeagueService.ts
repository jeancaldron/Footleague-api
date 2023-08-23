import { Types } from "mongoose";
import { DatabaseService } from "./databaseService";
import { FootballDataAPIService } from "./footballDataAPIService";

class ImportLeagueService {
  private databaseService: DatabaseService;
  private footballDataAPIService: FootballDataAPIService;

  public importLeague = async (leagueCode: string) => {
    try {
      this.databaseService = new DatabaseService();
      this.footballDataAPIService = new FootballDataAPIService();

      const leagueData = await this.footballDataAPIService.fetchLeagueData(
        leagueCode
      );

      let league = await this.databaseService.getLeagueByApiId(leagueData.id);

      if (!league) {
        league = await this.databaseService.createLeague({
          apiId: leagueData?.id,
          name: leagueData?.name,
          code: leagueData?.code,
          areaName: leagueData?.area?.name,
        });
      } else {
        return true;
      }

      const teams = await this.footballDataAPIService.fetchTeamsInLeague(
        leagueCode
      );

      await Promise.all(teams.map(this.processTeamData.bind(this, league)));

      return true;
    } catch (error) {
      console.error("Error importing league:", error);
      throw error;
    }
  };

  private processTeamData = async (
    league: { _id: Types.ObjectId },
    teamData: {
      id: number;
      name: any;
      tla: any;
      shortName: any;
      area: { name: any };
      address: any;
      squad: any[];
      coach: any;
    }
  ) => {
    let team = await this.databaseService.getTeamByApiId(teamData.id);

    if (!team) {
      team = await this.databaseService.createTeam({
        apiId: teamData?.id,
        name: teamData?.name,
        tla: teamData?.tla,
        shortName: teamData?.shortName,
        areaName: teamData?.area?.name,
        address: teamData?.address,
        leagues: [league?._id],
      });

      const squad = teamData.squad || [];
      if (squad.length >= 0) {
        await Promise.all(
          squad.map((player) => this.createPlayer(player, team._id))
        );
      } else {
        await this.createPlayer(teamData.coach, team._id);
      }
    } else if (!team.leagues.includes(league._id)) {
      await this.databaseService.updateTeamLeagues(team._id, league._id);
    }
  };

  private createPlayer = async (
    personData: {
      id: number;
      name: any;
      position: any;
      dateOfBirth: string | number | Date;
      nationality: any;
    },
    teamId: Types.ObjectId
  ) => {
    let person = await this.databaseService.getPlayerByApiId(personData.id);
    if (!person) {
      await this.databaseService.createPlayer({
        apiId: personData?.id,
        name: personData?.name,
        position: personData?.position,
        dateOfBirth: new Date(personData?.dateOfBirth),
        nationality: personData?.nationality,
        team: teamId,
      });
    }
  };
}

export { ImportLeagueService };
