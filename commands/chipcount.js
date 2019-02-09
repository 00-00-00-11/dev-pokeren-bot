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

		if (guildMembers.includes(args[1])) {
			Chipcount.deleteOne({ user_id: args[1] }, (err, updated) => {
				if (err) console.log(err);
				if (!updated) {
					return message.channel.send('No user found for given ID.');
				} else {
					return message.channel.send('Updated chipcount for user ' + args[1]);
				}
			});
		} else {
			Chipcount.deleteMany({}, (err, deleted) => {
				if (err) console.log(err);
				return message.channel.send('Chipcounts cleared.');
			});
		}
	} else if (args[0] === 'set') {
		// Only allow from permitted users
		if (!config.permittedUsers.includes(message.author.id)) return;

		if (guildMembers.includes(args[1])) {
			Chipcount.findOneAndUpdate(
				{ user_id: args[1] },
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
						return message.channel.send(args[1] + ' does not have a chipcount to update.');
					} else {
						return message.channel.send('Updated chipcount for user ' + args[1]);
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
			} else if (!Number(chipcounter)) {
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
