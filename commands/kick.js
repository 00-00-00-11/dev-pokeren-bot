const Kick = require("../models/kick.js");
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

  let tokick = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!tokick) return message.reply("Couldn't find user.");
  if (tokick.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't kick them!");

  let kickreason = args.slice(1).join(" ");

  await tokick.kick(kickreason);
  message.channel.send(`:ok_hand: <@${tokick.id}> has been kicked from ${message.guild.name} ` + "(`" + kickreason + "`)");

  const kick = new Kick({
    _id: mongoose.Types.ObjectId(),
    username: tokick.user.username,
    user_id: tokick.id,
    kicked_by: message.author.username,
    kicked_by_id: message.author.id,
    reason: kickreason,
    kicked_from_server: message.guild.name,
    timestamp: message.createdTimestamp
  });

  kick.save();
  // message.channel.send("Kick saved in database!");
};

module.exports.help = {
  name: "kick"
};
