const config = require('../../config.json');
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client({ disableEveryone: true });
const mongoose = require('mongoose');
const DiscordUser = require('../../models/discordUser');
// const staffServer = process.env.POKEREN_STAFF_SERVER;
// const mainServer = process.env.POKEREN_SERVER;

bot.commands = new Discord.Collection();

module.exports = (bot, message) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  const prefix = config.prefix;
  const messageArray = message.content.split(' ');
  const cmd = messageArray[0].toLowerCase();
  const args = message.content
    .slice(prefix.length)
    .split(/ +/)
    .slice(1);

  if (message.content.startsWith(config.prefix)) {
    const commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args);

    // Send commands used to event log server.
    // const g = bot.guilds.get(staffServer);
    // const ch = g.channels.get('543840893677993984');
    // if (message.guild.id !== mainServer) return;

    // ch.send(`**${message.author.tag}** used the command \`${message.content}\` in <#${message.channel.id}>`);
  } else {
    // Add users
    DiscordUser.findOne(
      {
        username: message.author.username,
        user_id: message.author.id
      },
      (err, user) => {
        if (err) console.log(err);
        if (!user) {
          const discordUser = new DiscordUser({
            _id: mongoose.Types.ObjectId(),
            username: message.author.username,
            user_tag: message.author.tag,
            user_id: message.author.id,
            server_name: message.guild.name,
            server_id: message.guild.id,
            user_created: message.author.createdTimestamp
          });

          discordUser.save().catch(err => console.log(err));
        } else {
          return;
        }
      }
    );
    // End add users
  }
};
