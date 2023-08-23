import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
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
  tla: {
    type: String,
  },
  shortName: {
    type: String,
  },
  areaName: {
    type: String,
  },
  address: {
    type: String,
  },
  leagues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
    },
  ],
});

teamSchema.virtual("Players", {
  ref: "Player",
  localField: "_id",
  foreignField: "team",
  justOne: false,
});

const TeamModel = mongoose.model("Team", teamSchema);
export { TeamModel };
