const RoyalCount = require('../models/royal-counter.js');
const config = require('../config.json');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

module.exports.run = async (bot, message, args) => {
	if (args[0] === 'edit' && isNaN(args[1])) {
		// Only allow from permitted users
		if (!config.permittedUsers.includes(message.author.id)) return;
		return message.channel.send('Missing or invalid number specified.');
	} else if (args[0] === 'edit' && args[1]) {
		// Only allow from permitted users
		if (!config.permittedUsers.includes(message.author.id)) return;
		// Update count
		RoyalCount.findOneAndUpdate(
			{
				type: 'RoyalCounter'
			},
			{
				$set: {
					count: args[1],
					timestamp: message.createdTimestamp
				}
			},
			{ new: true },
			(err, count) => {
				if (err) console.log(err);
				return message.channel.send(
					`Onze discord server heeft tot nu toe al ${count.count} Royal flushes gehad!`
				);
			}
		);
	} else if (args[0] === 'add') {
		// Add 1 to count
		RoyalCount.findOneAndUpdate(
			{
				type: 'RoyalCounter'
			},
			{
				$inc: {
					count: 1
				},
				$set: {
					timestamp: message.createdTimestamp
				}
			},
			{ new: true },
			(err, count) => {
				if (err) console.log(err);
				return message.channel.send(
					`Onze discord server heeft tot nu toe al ${count.count} Royal flushes gehad!`
				);
			}
		);
	} else {
		// Show count
		RoyalCount.findOne(
			{
				type: 'RoyalCounter'
			},
			(err, count) => {
				if (err) console.log(err);
				if (!count) {
					const newCount = new RoyalCount({
						_id: mongoose.Types.ObjectId(),
						server_name: message.guild.name,
						server_id: message.guild.id,
						type: 'RoyalCounter',
						count: 0,
						timestamp: message.createdTimestamp
					});
					message.channel.send(`No counter found. Creating..`);
					newCount.save();
				} else {
					return message.channel.send(
						`Gefeliciteerd <@${message.author
							.id}> met je Royal flush! Dit is royal flush nummer ${count.count} van onze ${message.guild
							.name} server!`
					);
				}
			}
		);
	}
};

module.exports.help = {
	name: 'royal'
};
