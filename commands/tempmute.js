const Tempmute = require("../models/tempmute.js");
const config = require("../config.json");
const ms = require("ms");

const mongoose = require("mongoose");
mongoose.connect(
  process.env.MONGODB_URL_1 + process.env.MONGODB_PASS + process.env.MONGODB_URL_2,
  { useNewUrlParser: true }
);

module.exports.run = async (bot, message, args) => {
  // Only allow command from permitted users.
  if (!config.permittedUsers.includes(message.author.id)) return;
  // return message.channel.send("No bot permissions.");

  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!tomute) return message.reply("Couldn't find user.");
  if (tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them! ");
  let muterole = message.guild.roles.find(roles => roles.name === "Muted");
  if (!muterole) {
    try {
      muterole = await message.guild.createRole({
        name: "uted",
        color: "#000000",
        permissions: []
      });
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch (e) {
      console.log(e.stack);
    }
  }
  let mutetime = args[1];
  if (!mutetime) return message.reply("You didn't specify a time!");

  let mutereason = args.slice(2).join(" ");

  await tomute.addRole(muterole.id);
  if (mutereason) {
    message.channel.send(`:ok_hand: <@${tomute.id}> has been muted for ${ms(ms(mutetime))} ` + "(`" + mutereason + "`)");
  } else {
    message.channel.send(`:ok_hand: <@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);
  }

  setTimeout(function() {
    tomute.removeRole(muterole.id);
    // message.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));

  const tempmute = new Tempmute({
    _id: mongoose.Types.ObjectId(),
    username: tomute.user.username,
    user_id: tomute.id,
    muted_by: message.author.username,
    reason: mutereason,
    duration: mutetime,
    timestamp: message.createdTimestamp
  });

  tempmute.save();
  // message.channel.send("Mute saved in database!");
};

module.exports.help = {
  name: "tempmute"
};
