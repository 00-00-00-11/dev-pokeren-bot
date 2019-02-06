const Discord = require('discord.js');
const config = require('../../config.json');
const Midstake = require('../../models/leaderboard/midstakes');

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

		winningsAmount = winningsAmount.replace('$', '').replace('€', '').replace('£', '').replace(',', '');

		Midstake.create((err, micro) => {
			if (err) console.log(err);
			if (!micro) {
				const newMidstake = new Midstake({
					_id: mongoose.Types.ObjectId(),
					player_name: playerName,
					poker_client: pokerClient,
					tournament_name: tournamentName,
					winnings: winningsAmount,
					date_won: dateWon,
					stake: 'Midstake',
					timestamp_added: message.createdTimestamp
				});
				newMidstake.save();
				message.channel.send('Midstakes added.');
			}
		});
	} else if (firstArg === 'clear') {
		// Only allow from permitted users
		if (!config.permittedUsers.includes(message.author.id)) return;

		Midstake.deleteMany({}, (err, deleted) => {
			if (err) console.log(err);
			return message.channel.send('Midstake leaderboard cleared.');
		});
	} else {
		Midstake.find({ stake: 'Midstake' }).sort([ [ 'winnings', 'descending' ] ]).exec((err, res) => {
			if (err) console.log(err);

			let midstakeEmbed = new Discord.RichEmbed().setTitle(`${message.guild.name} - Midstakes Leaderboard`);
			if (res.length === 0) {
				midstakeEmbed.setColor('#FF0000');
				midstakeEmbed.addField('No data found', 'Please add your winnings.');
			} else if (res.length < 3) {
				midstakeEmbed.setColor('#000000');
				for (let i = 0; i < res.length; i++) {
					let member = res[i].player_name || 'Username not found';
					if (member === 'Username not found') {
						midstakeEmbed.addField(
							`${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
							`**Date**: ${res[i].date_won} - **Winnings**: €${addCommas(res[i].winnings)}`
						);
					} else {
						midstakeEmbed.addField(
							`${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
							`**Date**: ${res[i].date_won} - **Winnings**: €${addCommas(res[i].winnings)}`
						);
					}
				}
			} else {
				midstakeEmbed.setColor('#00FFFF');
				for (let i = 0; i < 3; i++) {
					let member = res[i].player_name || 'Username not found';
					if (member === 'Username not found') {
						midstakeEmbed.addField(
							`${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
							`**Date**: ${res[i].date_won} - **Winnings**: €${addCommas(res[i].winnings)}`
						);
					} else {
						midstakeEmbed.addField(
							`${i + 1}. ${member} - ${res[i].tournament_name} - ${res[i].poker_client}`,
							`**Date**: ${res[i].date_won} - **Winnings**: €${addCommas(res[i].winnings)}`
						);
					}
				}
			}

			message.channel.send(midstakeEmbed);
		});
	}
};

module.exports.help = {
	name: 'midstakes'
};
