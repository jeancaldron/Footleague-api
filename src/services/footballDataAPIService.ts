import axios from "axios";
import rateLimit, { RateLimitedAxiosInstance } from "axios-rate-limit";
import dotenv from "dotenv";

dotenv.config();

class FootballDataAPIService {
  private BASE_URL = "https://api.football-data.org/v4/";
  private API_KEY = process.env.FOOTBALL_DATA_API_KEY;
  private apiClient: RateLimitedAxiosInstance;

  constructor() {
    this.apiClient = rateLimit(
      axios.create({
        baseURL: this.BASE_URL,
        headers: {
          "X-Auth-Token": this.API_KEY,
        },
      }),
      { maxRequests: 10, perMilliseconds: 60000 }
    );
  }

  public fetchLeagueData = async (leagueCode: string) => {
    try {
      const response = await this.apiClient.get(`competitions/${leagueCode}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching league data:", error);
      throw error;
    }
  };

  public fetchTeamsInLeague = async (leagueCode: string) => {
    try {
      const response = await this.apiClient.get(
        `competitions/${leagueCode}/teams`
      );
      return response.data.teams;
    } catch (error) {
      console.error("Error fetching teams in league:", error);
      throw error;
    }
  };
}

export { FootballDataAPIService };
