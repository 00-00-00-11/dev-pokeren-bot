const mongoose = require("mongoose");

const kickSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    user_id: String,
    kicked_by: String,
    kicked_by_id: String,
    reason: String,
    kicked_from_server: String,
    timestamp: String
  },
  { versionKey: false }
);

module.exports = mongoose.model("Kick", kickSchema);
