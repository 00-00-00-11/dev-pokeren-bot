const Discord = require('discord.js');
const config = require('../../config.json');
const Livescore = require('../../models/leaderboard/livescores');
const mongoose = require('mongoose');

const helpers = require('../../lib/helpers');

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

    Livescore.create((err, micro) => {
      if (err) console.log(err);
      if (!micro) {
        const newLivescore = new Livescore({
          _id: mongoose.Types.ObjectId(),
          player_name: playerName,
          poker_client: pokerClient,
          tournament_name: tournamentName,
          winnings: winningsAmount,
          date_won: dateWon,
          stake: 'Livescore',
          timestamp_added: message.createdTimestamp
        });
        newLivescore.save();
        message.channel.send('Livescores added.');
      }
    });
  } else if (firstArg === 'clear') {
    // Only allow from permitted users
    if (!config.permittedUsers.includes(message.author.id)) return;

    Livescore.deleteMany({}, (err, deleted) => {
      if (err) console.log(err);
      return message.channel.send('Livescore leaderboard cleared.');
    });
  } else {
    Livescore.find({ stake: 'Livescore' })
      .sort([['winnings', 'descending']])
      .exec((err, res) => {
        if (err) console.log(err);

        let livescoreEmbed = new Discord.RichEmbed().setTitle(`${message.guild.name} - Livescores Leaderboard`);
        if (res.length === 0) {
          livescoreEmbed.setColor('#FF0000');
          livescoreEmbed.addField('No data found', 'Please add your winnings.');
        } else if (res.length < 3) {
          livescoreEmbed.setColor('#000000');
          for (let i = 0; i < res.length; i++) {
            let member = res[i].player_name || 'Username not found';
            if (member === 'Username not found') {
              livescoreEmbed.addField(
                `${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
                `**Date**: ${res[i].date_won} - **Winnings**: €${helpers.withCommas(res[i].winnings)}`
              );
            } else {
              livescoreEmbed.addField(
                `${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
                `**Date**: ${res[i].date_won} - **Winnings**: €${helpers.withCommas(res[i].winnings)}`
              );
            }
          }
        } else {
          livescoreEmbed.setColor('#00FFFF');
          for (let i = 0; i < 3; i++) {
            let member = res[i].player_name || 'Username not found';
            if (member === 'Username not found') {
              livescoreEmbed.addField(
                `${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
                `**Date**: ${res[i].date_won} - **Winnings**: €${helpers.withCommas(res[i].winnings)}`
              );
            } else {
              livescoreEmbed.addField(
                `${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
                `**Date**: ${res[i].date_won} - **Winnings**: €${helpers.withCommas(res[i].winnings)}`
              );
            }
          }
        }

        message.channel.send(livescoreEmbed);
      });
  }
};

module.exports.help = {
  name: 'livescores',
  alias: 'livetop3'
};
