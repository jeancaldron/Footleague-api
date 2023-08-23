import mongoose from "mongoose";

const leagueSchema = new mongoose.Schema({
  apiId: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  areaName: {
    type: String,
    required: true,
  },
});

leagueSchema.virtual("Teams", {
  ref: "Team",
  localField: "_id",
  foreignField: "leagues",
  justOne: false,
});

const LeagueModel = mongoose.model("League", leagueSchema);
export { LeagueModel };
