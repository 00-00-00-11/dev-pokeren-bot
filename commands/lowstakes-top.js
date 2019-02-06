const Discord = require('discord.js');
const config = require('../config.json');
const Lowstake = require('../models/lowstakes-top');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL_1 + process.env.MONGODB_PASS + process.env.MONGODB_URL_2, {
	useNewUrlParser: true
});

function addCommas(nStr) {
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

module.exports.run = async (bot, message, args) => {
	let addMicro = args.shift();
	let dateWon = args.pop();
	let winningsAmount = args.pop();
	let playerName = args.shift();
	let pokerClient = args.shift();
	let tournamentName = args.join(' ');

	if (addMicro === 'add') {
		if (!playerName || !pokerClient || !tournamentName || !winningsAmount || !dateWon)
			return message.channel.send('Missing fields or incorrect format.');

		// Only allow from permitted users
		if (!config.permittedUsers.includes(message.author.id)) return;

		winningsAmount = winningsAmount.replace('$', '').replace('€', '').replace('£', '').replace(',', '');

		Lowstake.create((err, micro) => {
			if (err) console.log(err);
			if (!micro) {
				const newLowstake = new Lowstake({
					_id: mongoose.Types.ObjectId(),
					player_name: playerName,
					poker_client: pokerClient,
					tournament_name: tournamentName,
					winnings: winningsAmount,
					date_won: dateWon,
					stake: 'Lowstake',
					timestamp_added: message.createdTimestamp
				});
				newLowstake.save();
				message.channel.send('Lowstakes added.');
			}
		});
	} else {
		Lowstake.find({ stake: 'Lowstake' }).sort([ [ 'winnings', 'descending' ] ]).exec((err, res) => {
			if (err) console.log(err);

			let lowstakeEmbed = new Discord.RichEmbed().setTitle(`${message.guild.name} - Lowstakes Leaderboard`);
			if (res.length === 0) {
				lowstakeEmbed.setColor('#FF0000');
				lowstakeEmbed.addField('No data found', 'Please add your winnings.');
			} else if (res.length < 3) {
				lowstakeEmbed.setColor('#000000');
				for (let i = 0; i < res.length; i++) {
					let member = res[i].player_name || 'Username not found';
					if (member === 'Username not found') {
						lowstakeEmbed.addField(`${i + 1}. ${member}`, `**Winnings**: €${addCommas(res[i].winnings)}`);
					} else {
						lowstakeEmbed.addField(`${i + 1}. ${member}`, `**Winnings**: €${addCommas(res[i].winnings)}`);
					}
				}
			} else {
				lowstakeEmbed.setColor('#00FFFF');
				for (let i = 0; i < 3; i++) {
					let member = res[i].player_name || 'Username not found';
					if (member === 'Username not found') {
						lowstakeEmbed.addField(`${i + 1}. ${member}`, `**Winnings**: €${addCommas(res[i].winnings)}`);
					} else {
						lowstakeEmbed.addField(
							`${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
							`**Date**: ${res[i].date_won} - **Winnings**: €${addCommas(res[i].winnings)}`
						);
					}
				}
			}

			message.channel.send(lowstakeEmbed);
		});
	}
};

module.exports.help = {
	name: 'lowstakes'
};
