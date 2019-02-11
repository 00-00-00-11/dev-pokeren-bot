const Chipcount = require('../models/chipcount.js');
const config = require('../config.json');
const mongoose = require('mongoose');
const mainServer = process.env.POKEREN_SERVER;

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

function numberWithCommas(number) {
	var parts = number.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

module.exports.run = async (bot, message, args) => {
	const guildMembers = [];
	const allMembers = bot.guilds.get(mainServer);
	allMembers.members.forEach((member) => guildMembers.push(member.user.id));

	if (args[0] === 'clear') {
		// Only allow from permitted users
		if (!config.permittedUsers.includes(message.author.id)) return;

		if (!args[1]) return message.channel.send('No user specified. To clear all, use `!chipcounts clear`');
		if (args[1]) {
			const findId = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);
			if (!findId) return message.channel.send('No user found for given ID.');
			const clearUser = findId.user.id;

			if (guildMembers.includes(clearUser)) {
				Chipcount.deleteOne({ user_id: clearUser }, (err, updated) => {
					if (err) console.log(err);
					if (!updated) {
						return message.channel.send('No user found for given ID.');
					} else {
						return message.channel.send('Removed chipcount for user ' + clearUser);
					}
				});
			}
		}
	} else if (args[0] === 'set') {
		// Only allow from permitted users
		if (!config.permittedUsers.includes(message.author.id)) return;

		const findId = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]) || args[1];
		if (!findId.user) return message.channel.send('No user with such ID.');
		const clearUser = findId.user.id;
		if (args[2] === '0') return message.channel.send('Please use `!chipcount clear <discord_id/tag>` instead');

		if (guildMembers.includes(clearUser)) {
			Chipcount.findOneAndUpdate(
				{ user_id: clearUser },
				{
					$set: {
						chipcount: args[2],
						timestamp: message.createdTimestamp
					}
				},
				{ new: true },
				(err, updated) => {
					if (err) console.log(err);
					if (!updated) {
						return message.channel.send(clearUser + ' does not have a chipcount to update.');
					} else {
						return message.channel.send('Updated chipcount for user ' + clearUser);
					}
				}
			);
		} else {
			return message.channel.send('No user found for given ID.');
		}
	} else {
		let chipcounter = args.pop();
		let namer;
		if (args.length >= 1) {
			namer = args.join(' ');
		} else {
			namer = args[0];
		}

		if (chipcounter) chipcounter = chipcounter.replace(/[.,\s]/g, '');
		if (!namer && chipcounter) return message.channel.send('Missing name or chipcount.');

		if (namer && chipcounter) {
			if (chipcounter == 0) {
				Chipcount.deleteOne({ user_id: message.author.id }, (err, deleted) => {
					if (err) console.log(err);
					return message.channel.send('Chipcount deleted.');
				});
			} else if (isNaN(chipcounter)) {
				return message.channel.send('Invalid chipcount. Must be a number without commas, periods, or spaces.');
			} else if (chipcounter > 0) {
				Chipcount.findOneAndUpdate(
					{ user_id: message.author.id },
					{
						$set: {
							name: namer,
							chipcount: chipcounter,
							timestamp: message.createdTimestamp
						}
					},
					{ new: true },
					(err, chipcount) => {
						if (err) console.log(err);
						if (!chipcount) {
							const newChipcount = new Chipcount({
								_id: mongoose.Types.ObjectId(),
								username: message.author.username,
								user_id: message.author.id,
								server_name: message.guild.name,
								server_id: message.guild.id,
								name: namer,
								chipcount: chipcounter,
								timestamp: message.createdTimestamp
							});
							newChipcount.save();
							message.channel.send(`Chipcount created with chipcount ${numberWithCommas(chipcounter)}`);
						} else {
							return message.channel.send(`Chipcount updated to ${numberWithCommas(chipcount.chipcount)}`);
						}
					}
				);
			}
		} else {
			Chipcount.findOne({ user_id: message.author.id }, (err, chipcount) => {
				if (err) console.log(err);
				if (!chipcount) {
					const newChipcount = new Chipcount({
						_id: mongoose.Types.ObjectId(),
						username: message.author.username,
						user_id: message.author.id,
						server_name: message.guild.name,
						server_id: message.guild.id,
						name: message.author.username,
						chipcount: 0,
						timestamp: message.createdTimestamp
					});
					newChipcount.save();
					message.channel.send(`Chipcount created.`);
				} else {
					return message.channel.send(`Your chipcount is ${numberWithCommas(chipcount.chipcount)}`);
				}
			});
		}
	}
};

module.exports.help = {
	name: 'chipcount'
};
