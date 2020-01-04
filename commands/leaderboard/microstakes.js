const Discord = require('discord.js');
const config = require('../../config.json');
const Microstake = require('../../models/leaderboard/microstakes');
const mongoose = require('mongoose');

import { withCommas } from '../../lib/helpers';

module.exports.run = async (bot, message, args) => {
  // Fix for double spaces in code.
  args = args.filter(function(e) {
    return e.replace(/(\r\n|\n|\r)/gm, '');
  });

  let firstArg = args.shift();
  let dateWon = args.pop();
  let winningsAmount = args.pop();
  let playerName = args.shift();
  let pokerClient = args.shift();
  let tournamentName = args.join(' ');

  if (firstArg === 'add') {
    if (!playerName || !pokerClient || !tournamentName || !winningsAmount || !dateWon)
      return message.channel.send('Missing fields or incorrect format.');

    // Only allow from permitted users
    if (!config.permittedUsers.includes(message.author.id)) return;

    winningsAmount = winningsAmount
      .replace('$', '')
      .replace('€', '')
      .replace('£', '')
      .replace(',', '');

    Microstake.create((err, micro) => {
      if (err) console.log(err);
      if (!micro) {
        const newMicrostake = new Microstake({
          _id: mongoose.Types.ObjectId(),
          player_name: playerName,
          poker_client: pokerClient,
          tournament_name: tournamentName,
          winnings: winningsAmount,
          date_won: dateWon,
          stake: 'Microstake',
          timestamp_added: message.createdTimestamp
        });
        newMicrostake.save();
        message.channel.send('Microstakes added.');
      }
    });
  } else if (firstArg === 'clear') {
    // Only allow from permitted users
    if (!config.permittedUsers.includes(message.author.id)) return;

    Microstake.deleteMany({}, (err, deleted) => {
      if (err) console.log(err);
      return message.channel.send('Microstake leaderboard cleared.');
    });
  } else {
    Microstake.find({ stake: 'Microstake' })
      .sort([['winnings', 'descending']])
      .exec((err, res) => {
        if (err) console.log(err);

        let microstakesEmbed = new Discord.RichEmbed().setTitle(`${message.guild.name} - Microstakes Leaderboard`);
        if (res.length === 0) {
          microstakesEmbed.setColor('#FF0000');
          microstakesEmbed.addField('No data found', 'Please add your winnings.');
        } else if (res.length < 3) {
          microstakesEmbed.setColor('#000000');
          for (let i = 0; i < res.length; i++) {
            let member = res[i].player_name || 'Username not found';
            if (member === 'Username not found') {
              microstakesEmbed.addField(
                `${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
                `**Date**: ${res[i].date_won} - **Winnings**: €${withCommas(res[i].winnings)}`
              );
            } else {
              microstakesEmbed.addField(
                `${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
                `**Date**: ${res[i].date_won} - **Winnings**: €${withCommas(res[i].winnings)}`
              );
            }
          }
        } else {
          microstakesEmbed.setColor('#00FFFF');
          for (let i = 0; i < 3; i++) {
            let member = res[i].player_name || 'Username not found';
            if (member === 'Username not found') {
              microstakesEmbed.addField(
                `${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
                `**Date**: ${res[i].date_won} - **Winnings**: €${withCommas(res[i].winnings)}`
              );
            } else {
              microstakesEmbed.addField(
                `${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
                `**Date**: ${res[i].date_won} - **Winnings**: €${withCommas(res[i].winnings)}`
              );
            }
          }
        }

        message.channel.send(microstakesEmbed);
      });
  }
};

module.exports.help = {
  name: 'microstakes'
};
