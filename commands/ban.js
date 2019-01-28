const Ban = require("../models/ban.js");
const config = require("../config.json");

const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGODB_URL_1 + process.env.MONGODB_PASS + process.env.MONGODB_URL_2,
  { useNewUrlParser: true }
);

module.exports.run = async (bot, message, args) => {
  // Only allow command from permitted users.
  if (!config.permittedUsers.includes(message.author.id)) return;
  // return message.channel.send("No bot permissions.");

  let toban = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!toban) return message.reply("Couldn't find user.");
  if (toban.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't ban them!");

  let banreason = args.slice(1).join(" ");

  await toban.ban(banreason);
  message.channel.send(`:ok_hand: <@${toban.id}> has been banned from ${message.guild.name}.` + "(`" + banreason + "`)");

  const ban = new Ban({
    _id: mongoose.Types.ObjectId(),
    username: toban.user.username,
    user_id: toban.id,
    banned_by: message.author.username,
    banned_by_id: message.author.id,
    reason: banreason,
    timestamp: message.createdTimestamp
  });

  ban.save();
  // message.channel.send("Ban saved in database!");
};

module.exports.help = {
  name: "ban"
};
