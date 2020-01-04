const Discord = require('discord.js');
const Chipcount = require('../models/chipcount.js');
const TournamentTitle = require('../models/tournamentTitle.js');

const helpers = require('../lib/helpers');

module.exports.run = async (bot, message, args) => {
  let allChipcounts = [];

  TournamentTitle.findOne({ type: 'TournamentTitle' }).exec((err, tTitle) => {
    if (err) console.log(err);

    Chipcount.find({ server_id: message.guild.id })
      .sort([['chipcount', 'descending']])
      .exec((err, res) => {
        if (err) console.log(err);

        if (res.length === 0) {
          return message.channel.send('No chipcounts found.');
        } else {
          for (let i = 0; i < res.length; i++) {
            allChipcounts.push(res[i].chipcount);
          }

          const totalChips = allChipcounts.reduce((a, b) => a + b, 0);

          let totalChipsEmbed = new Discord.RichEmbed()
            .setTitle(`**${tTitle.title || message.guild.name}**`)
            .setColor('#00FF00')
            .addField(`Total Chipcount`, `${helpers.withCommas(totalChips)}`)
            .addField(`Current Chipleader`, `${res[0].name} - ${helpers.withCommas(res[0].chipcount)}`);

          return message.channel.send(totalChipsEmbed);
        }
      });
  });
};

module.exports.help = {
  name: 'totalchips'
};
