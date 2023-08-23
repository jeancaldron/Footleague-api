import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  apiId: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  name: {
    type: String,
  },
  position: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  nationality: {
    type: String,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
});

const PlayerModel = mongoose.model("Player", playerSchema);
export { PlayerModel };
