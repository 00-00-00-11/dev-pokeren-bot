const Discord = require('discord.js');
const config = require('../config.json');
const Chipcount = require('../models/chipcount.js');
const TournamentTitle = require('../models/tournamentTitle.js');
const fs = require('fs');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

function numberWithCommas(number) {
	var parts = number.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

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
	} else {
		TournamentTitle.findOne({ type: 'TournamentTitle' }).exec((err, tTitle) => {
			if (err) console.log(err);

			Chipcount.find({ server_id: message.guild.id }).sort([ [ 'chipcount', 'descending' ] ]).exec((err, res) => {
				if (err) console.log(err);

				let leveltopEmbed = new Discord.RichEmbed().setTitle(
					`Current Chipcounts - ${tTitle.title || message.guild.name}`
				);
				if (res.length === 0) {
					leveltopEmbed.setColor('#FF0000');
					leveltopEmbed.addField('No data found');
				} else if (res.length < 10) {
					leveltopEmbed.setColor('#00FF00');
					for (let i = 0; i < res.length; i++) {
						let member = message.guild.members.get(res[i].user_id) || 'Username not found';
						if (member === 'Username not found') {
							leveltopEmbed.addField(
								`${i + 1}. ${member}`,
								`**Chips**: ${numberWithCommas(res[i].chipcount)}`
							);
						} else {
							leveltopEmbed.addField(
								`${i + 1}. ${res[i].name}`,
								`**Chips**: ${numberWithCommas(res[i].chipcount)}`
							);
						}
					}
				} else {
					leveltopEmbed.setColor('#00FF00');
					for (let i = 0; i < 10; i++) {
						let member = message.guild.members.get(res[i].user_id) || 'Username not found';
						if (member === 'Username not found') {
							leveltopEmbed.addField(
								`${i + 1}. ${member}`,
								`**Chips**: ${numberWithCommas(res[i].chipcount)}`
							);
						} else {
							leveltopEmbed.addField(
								`${i + 1}. ${res[i].name}`,
								`**Chips**: ${numberWithCommas(res[i].chipcount)}`
							);
						}
					}
				}

				message.channel.send(leveltopEmbed);
			});
		});
	}
};

module.exports.help = {
	name: 'chipcounts'
};
