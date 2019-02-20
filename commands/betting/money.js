const config = require('../../config.json');
const mongoose = require('mongoose');
const Money = require('../../models/betting/money');
const ms = require('parse-ms');

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

function numberWithCommas(number) {
	var parts = number.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

function generateDaily(min, max) {
	return Math.floor(min + Math.random() * (max + 1 - min));
}

module.exports.run = async (bot, message, args) => {
	if (message.channel.id !== '537750090677485598') return;

	const cooldown = 43200000;

	if (args[0] === 'giveall') {
		// Only allow from permitted users
		if (!config.permittedUsers.includes(message.author.id)) return;
		if (!args[1]) return message.channel.send('Missing amount to give.');

		const givenAmount = args[1];

		Money.updateMany(
			{},
			{
				$inc: {
					money: givenAmount
				}
			},
			(err, updated) => {
				if (err) console.log(err);

				return message.channel.send(`Gave all users in database €${numberWithCommas(givenAmount)}!`);
			}
		);
	} else if (args[0] === 'daily') {
		const dailyAmount = generateDaily(300, 400);

		Money.findOneAndUpdate({ user_id: message.author.id }, { new: true }, (err, money) => {
			if (err) console.log(err);
			if (!money) {
				const newMoney = new Money({
					_id: mongoose.Types.ObjectId(),
					username: message.author.username,
					user_id: message.author.id,
					server_name: message.guild.name,
					server_id: message.guild.id,
					money: 0 + dailyAmount,
					last_daily: message.createdTimestamp
				});
				newMoney.save();
				return message.channel.send(`Money created with €${numberWithCommas(dailyAmount)}.`);
			} else {
				const lastDaily = money.last_daily;

				if (cooldown - (Date.now() - lastDaily) > 0) {
					const timeObj = ms(cooldown - (Date.now() - lastDaily));
					return message.channel.send(`You already collected this, please wait ${timeObj.hours}h ${timeObj.minutes}m!`);
				} else {
					money.money = money.money + dailyAmount;
					money.last_daily = Date.now();
					money.save();
					return message.channel.send(`You received €${dailyAmount}.`);
				}
			}
		});
	} else {
		Money.findOne({ user_id: message.author.id }, (err, money) => {
			if (err) console.log(err);
			if (!money) {
				const newMoney = new Money({
					_id: mongoose.Types.ObjectId(),
					username: message.author.username,
					user_id: message.author.id,
					server_name: message.guild.name,
					server_id: message.guild.id,
					money: 0,
					last_daily: null
				});
				newMoney.save();
				message.channel.send(`Money created with €0. Use \`!money daily\` to get some.`);
			} else {
				return message.channel.send(`You have €${numberWithCommas(money.money)}.`);
			}
		});
	}
};

module.exports.help = {
	name: 'money'
};
