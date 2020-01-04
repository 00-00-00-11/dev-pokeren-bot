const Discord = require('discord.js');
const config = require('../../config.json');
const Highstake = require('../../models/leaderboard/highstakes');
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

    Highstake.create((err, micro) => {
      if (err) console.log(err);
      if (!micro) {
        const newHighstake = new Highstake({
          _id: mongoose.Types.ObjectId(),
          player_name: playerName,
          poker_client: pokerClient,
          tournament_name: tournamentName,
          winnings: winningsAmount,
          date_won: dateWon,
          stake: 'Highstake',
          timestamp_added: message.createdTimestamp
        });
        newHighstake.save();
        message.channel.send('Highstakes added.');
      }
    });
  } else if (firstArg === 'clear') {
    // Only allow from permitted users
    if (!config.permittedUsers.includes(message.author.id)) return;

    Highstake.deleteMany({}, (err, deleted) => {
      if (err) console.log(err);
      return message.channel.send('Highstake leaderboard cleared.');
    });
  } else {
    Highstake.find({ stake: 'Highstake' })
      .sort([['winnings', 'descending']])
      .exec((err, res) => {
        if (err) console.log(err);

        let highstakeEmbed = new Discord.RichEmbed().setTitle(`${message.guild.name} - Highstakes Leaderboard`);
        if (res.length === 0) {
          highstakeEmbed.setColor('#FF0000');
          highstakeEmbed.addField('No data found', 'Please add your winnings.');
        } else if (res.length < 3) {
          highstakeEmbed.setColor('#000000');
          for (let i = 0; i < res.length; i++) {
            let member = res[i].player_name || 'Username not found';
            if (member === 'Username not found') {
              highstakeEmbed.addField(
                `${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
                `**Date**: ${res[i].date_won} - **Winnings**: €${withCommas(res[i].winnings)}`
              );
            } else {
              highstakeEmbed.addField(
                `${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
                `**Date**: ${res[i].date_won} - **Winnings**: €${withCommas(res[i].winnings)}`
              );
            }
          }
        } else {
          highstakeEmbed.setColor('#00FFFF');
          for (let i = 0; i < 3; i++) {
            let member = res[i].player_name || 'Username not found';
            if (member === 'Username not found') {
              highstakeEmbed.addField(
                `${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
                `**Date**: ${res[i].date_won} - **Winnings**: €${withCommas(res[i].winnings)}`
              );
            } else {
              highstakeEmbed.addField(
                `${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
                `**Date**: ${res[i].date_won} - **Winnings**: €${withCommas(res[i].winnings)}`
              );
            }
          }
        }

        message.channel.send(highstakeEmbed);
      });
  }
};

module.exports.help = {
  name: 'highstakes'
};
