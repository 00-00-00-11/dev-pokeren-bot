const FTCount = require('../models/ft-counter.js');
const config = require('../config.json');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL_1 + process.env.MONGODB_PASS + process.env.MONGODB_URL_2, {
	useNewUrlParser: true
});

module.exports.run = async (bot, message, args) => {
	if (args[0] === 'edit' && isNaN(args[1])) {
		// Only allow from permitted users
		if (!config.permittedUsers.includes(message.author.id)) return;
		return message.channel.send('Missing or invalid number specified.');
	} else if (args[0] === 'edit' && args[1]) {
		// Only allow from permitted users
		if (!config.permittedUsers.includes(message.author.id)) return;
		// Update count
		FTCount.findOneAndUpdate(
			{
				type: 'FTCounter'
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
				return message.channel.send(`Onze discord server heeft tot nu toe al ${count.count} FT's gehad!`);
			}
		);
	} else if (args[0] === 'add') {
		// Add 1 to count
		FTCount.findOneAndUpdate(
			{
				type: 'FTCounter'
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
				return message.channel.send(`Onze discord server heeft tot nu toe al ${count.count} FT's gehad!`);
			}
		);
	} else {
		// Show count
		FTCount.findOne(
			{
				type: 'FTCounter'
			},
			(err, count) => {
				if (err) console.log(err);
				if (!count) {
					const newCount = new FTCount({
						_id: mongoose.Types.ObjectId(),
						server_name: message.guild.name,
						server_id: message.guild.id,
						type: 'FTCounter',
						count: 0,
						timestamp: message.createdTimestamp
					});
					message.channel.send(`No counter found. Creating..`);
					newCount.save();
				} else {
					return message.channel.send(
						`Hallo <@${message.author
							.id}>! Heel veel succes aan de finale tafel! Dit is finale tafel nummer ${count.count} van onze ${message
							.guild.name} server!`
					);
				}
			}
		);
	}
};

module.exports.help = {
	name: 'ft'
};
