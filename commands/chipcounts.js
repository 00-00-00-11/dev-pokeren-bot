const Discord = require('discord.js');
const config = require('../config.json');
const Chipcount = require('../models/chipcount.js');
const TournamentTitle = require('../models/tournamentTitle.js');
const mongoose = require('mongoose');

import { withCommas } from '../lib/helpers';

module.exports.run = async (bot, message, args) => {
  let newTitle;
  if (args[0] === 'title') {
    // Only allow from permitted users
    if (!config.permittedUsers.includes(message.author.id)) return;

    args.shift();
    newTitle = args.join(' ');

    if (newTitle === '') return message.channel.send('Missing title.');

    TournamentTitle.findOneAndUpdate(
      { type: 'TournamentTitle' },
      {
        $set: {
          title: newTitle
        }
      },
      { new: true },
      (err, title) => {
        if (err) console.log(err);
        if (!title) {
          const newTournamentTitle = new TournamentTitle({
            _id: mongoose.Types.ObjectId(),
            username: message.author.username,
            user_id: message.author.id,
            type: 'TournamentTitle',
            title: newTitle,
            timestamp: message.createdTimestamp
          });
          newTournamentTitle.save();
          return message.channel.send(`No title found. Creating..`);
        } else {
          return message.channel.send(`Title updated to ${newTitle}`);
        }
      }
    );
  } else if (args[0] === 'removetitle') {
    // Only allow from permitted users
    if (!config.permittedUsers.includes(message.author.id)) return;

    TournamentTitle.findOneAndUpdate(
      { type: 'TournamentTitle' },
      {
        $set: {
          title: ''
        }
      },
      { new: true },
      (err, title) => {
        if (err) console.log(err);
        return message.channel.send(`Title removed.`);
      }
    );
  } else if (args[0] === 'clear') {
    // Only allow from permitted users
    if (!config.permittedUsers.includes(message.author.id)) return;

    Chipcount.deleteMany({}, (err, deleted) => {
      if (err) console.log(err);
      return message.channel.send('All chipcounts cleared.');
    });
  } else {
    TournamentTitle.findOne({ type: 'TournamentTitle' }).exec((err, tTitle) => {
      if (err) console.log(err);

      Chipcount.find({ server_id: message.guild.id })
        .sort([['chipcount', 'descending']])
        .exec((err, res) => {
          if (err) console.log(err);

          let ccArr = [];

          let leveltopEmbed = new Discord.RichEmbed().setTitle(
            `Current Chipcounts - ${tTitle.title || message.guild.name}`
          );
          if (res.length === 0) {
            leveltopEmbed.setColor('#FF0000');
            leveltopEmbed.addField('No data found', 'Please add your chipcounts');
          } else if (res.length <= 10) {
            leveltopEmbed.setColor('#00FF00');
            for (let i = 0; i < res.length; i++) {
              let member = message.guild.members.get(res[i].user_id) || 'Username not found';
              if (member === 'Username not found') {
                leveltopEmbed.addField(`${i + 1}. ${member}`, `**Chips**: ${withCommas(res[i].chipcount)}`);
              } else {
                leveltopEmbed.addField(`${i + 1}. ${res[i].name}`, `**Chips**: ${withCommas(res[i].chipcount)}`);
              }
            }
          } else if (res.length < 50) {
            leveltopEmbed.setColor('#00FF00');
            for (let i = 0; i < res.length; i++) {
              let member = message.guild.members.get(res[i].user_id) || 'Username not found';
              if (member === 'Username not found') {
                ccArr.push(`${i + 1}. ${member} ${withCommas(res[i].chipcount)}`);
              } else {
                ccArr.push(`${i + 1}. ${res[i].name} ${withCommas(res[i].chipcount)}`);
              }
            }
            leveltopEmbed.setDescription(ccArr);
          } else {
            leveltopEmbed.setColor('#00FF00');
            for (let i = 0; i < 50; i++) {
              let member = message.guild.members.get(res[i].user_id) || 'Username not found';
              if (member === 'Username not found') {
                ccArr.push(`${i + 1}. ${member} ${withCommas(res[i].chipcount)}`);
              } else {
                ccArr.push(`${i + 1}. ${res[i].name} ${withCommas(res[i].chipcount)}`);
              }
            }
            ccArr.push('\u200b');
            ccArr.push(`Showing 50/${res.length} players`);
            leveltopEmbed.setDescription(ccArr);
          }

          leveltopEmbed.setTimestamp();
          leveltopEmbed.setFooter(`Brush Bot v${config.version} by Jan`);

          message.channel.send(leveltopEmbed);
        });
    });
  }
};

module.exports.help = {
  name: 'chipcounts'
};
