const mongoose = require("mongoose");

const banSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    user_id: String,
    banned_by: String,
    banned_by_id: String,
    reason: String,
    timestamp: String
  },
  { versionKey: false }
);

module.exports = mongoose.model("Ban", banSchema);
