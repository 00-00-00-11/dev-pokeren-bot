const mongoose = require("mongoose");

const chipcountSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    user_id: String,
    server_name: String,
    server_id: String,
    name: String,
    chipcount: Number,
    timestamp: String
  },
  { versionKey: false }
);

module.exports = mongoose.model("Chipcount", chipcountSchema);
