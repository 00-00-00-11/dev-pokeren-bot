const mongoose = require("mongoose");

const discordUserSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    user_tag: String,
    user_id: String,
    server_name: String,
    server_id: String,
    user_created: Number
  },
  { versionKey: false }
);

module.exports = mongoose.model("DiscordUser", discordUserSchema);
