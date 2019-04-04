const Discord = require('discord.js');
const Money = require('../../models/betting/money');

function numberWithCommas(number) {
	var parts = number.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

function capitalizeFirstLetter(string) {
	return string[0].toUpperCase() + string.slice(1);
}

module.exports.run = async (bot, message, args) => {
	if (message.channel.id !== '537750090677485598') return message.channel.send('Only available in <#537750090677485598>');
	if (!args[0] || !args[1]) return message.channel.send('Missing bet.');

	const roulette = [
		{ color: 'Green', number: '0' },
		{ color: 'Red', number: '1' },
		{ color: 'Black', number: '2' },
		{ color: 'Red', number: '3' },
		{ color: 'Black', number: '4' },
		{ color: 'Red', number: '5' },
		{ color: 'Black', number: '6' },
		{ color: 'Red', number: '7' },
		{ color: 'Black', number: '8' },
		{ color: 'Red', number: '9' },
		{ color: 'Black', number: '10' },
		{ color: 'Black', number: '11' },
		{ color: 'Red', number: '12' },
		{ color: 'Black', number: '13' },
		{ color: 'Red', number: '14' },
		{ color: 'Black', number: '15' },
		{ color: 'Red', number: '16' },
		{ color: 'Black', number: '17' },
		{ color: 'Red', number: '18' },
		{ color: 'Red', number: '19' },
		{ color: 'Black', number: '20' },
		{ color: 'Red', number: '21' },
		{ color: 'Black', number: '22' },
		{ color: 'Red', number: '23' },
		{ color: 'Black', number: '24' },
		{ color: 'Red', number: '25' },
		{ color: 'Black', number: '26' },
		{ color: 'Red', number: '27' },
		{ color: 'Black', number: '28' },
		{ color: 'Black', number: '29' },
		{ color: 'Red', number: '30' },
		{ color: 'Black', number: '31' },
		{ color: 'Red', number: '32' },
		{ color: 'Black', number: '33' },
		{ color: 'Red', number: '34' },
		{ color: 'Black', number: '35' },
		{ color: 'Red', number: '36' }
	];

	Money.findOne({ user_id: message.author.id }, (err, money) => {
		if (err) console.log(err);
		if (!money) {
			return message.channel.send("You don't have any money! Use `!money daily` to get some.");
		} else {
			const rltNumber = Math.floor(Math.random() * roulette.length);
			const playerIcon = message.author.displayAvatarURL;
			const betAmount = parseInt(args[1]);
			const validColors = [ 'green', 'red', 'black' ];
			let guessColor = args[0];
			guessColor = guessColor.toLowerCase();

			if (!betAmount) return message.channel.send('Missing bet amount. `!roulette <color/number> <bet>`');
			if (isNaN(betAmount)) return message.channel.send('Invalid bet amount.');
			if (betAmount < 1) return message.channel.send('Min bet is €1');
			if (money.money == 0) return message.channel.send('You have €0. Use `!money daily` to get some.');
			if (betAmount > 5000) return message.channel.send('Max bet is €5,000!');
			if (betAmount > money.money) return message.channel.send("Can't bet more than you've got!");

			// Color bets
			if (validColors.includes(guessColor)) {
				guessColor = capitalizeFirstLetter(guessColor);
				const resultColor = roulette[rltNumber].color;
				const resultNumber = roulette[rltNumber].number;
				const winAmount = betAmount + betAmount; // 1:1

				if (guessColor == resultColor) {
					const winEmbed = new Discord.RichEmbed()
						.setTitle(`🎰 Roulette 🎰`)
						.addField(`Guess:`, `${guessColor}`, true)
						.addField(`Result:`, `${resultColor} ${resultNumber}`, true)
						.setTimestamp()
						.setFooter(`You won €${numberWithCommas(winAmount)}!`, `${playerIcon}`)
						.setColor('#00ff00');

					money.money = money.money - betAmount + winAmount;
					money.save();
					return message.channel.send(winEmbed);
				} else {
					const loseEmbed = new Discord.RichEmbed()
						.setTitle(`🎰 Roulette 🎰`)
						.addField(`Guess:`, `${guessColor}`, true)
						.addField(`Result:`, `${resultColor} ${resultNumber}`, true)
						.setTimestamp()
						.setFooter(`You lost €${numberWithCommas(betAmount)}!`, `${playerIcon}`)
						.setColor('#ff0000');

					money.money = money.money - betAmount;
					money.save();
					return message.channel.send(loseEmbed);
				}
			} else {
				// Number bets
				if (args[0] < 0) return message.channel.send('Guess must be number 0-36');
				if (args[0] > 36) return message.channel.send('Guess must be number 0-36');
				if (isNaN(args[0]) || isNaN(args[1])) return message.channel.send('Invalid bet or guess.');

				const guessNumber = args[0];
				const guessColor = roulette[guessNumber].color;
				const resultNumber = roulette[rltNumber].number;
				const resultColor = roulette[rltNumber].color;
				const winAmount = betAmount * 35 + betAmount; // 35:1

				if (guessNumber == resultNumber) {
					const winEmbed = new Discord.RichEmbed()
						.setTitle(`🎰 Roulette 🎰`)
						.addField(`Guess:`, `${guessColor} ${guessNumber}`, true)
						.addField(`Result:`, `${resultColor} ${resultNumber}`, true)
						.setTimestamp()
						.setFooter(`You won €${numberWithCommas(winAmount)}!`, `${playerIcon}`)
						.setColor('#00ff00');

					money.money = money.money - betAmount + winAmount;
					money.save();
					return message.channel.send(winEmbed);
				} else {
					const loseEmbed = new Discord.RichEmbed()
						.setTitle(`🎰 Roulette 🎰`)
						.addField(`Guess:`, `${guessColor} ${guessNumber}`, true)
						.addField(`Result:`, `${resultColor} ${resultNumber}`, true)
						.setTimestamp()
						.setFooter(`You lost €${numberWithCommas(betAmount)}!`, `${playerIcon}`)
						.setColor('#ff0000');

					money.money = money.money - betAmount;
					money.save();
					return message.channel.send(loseEmbed);
				}
			}
		}
	});
};

module.exports.help = {
	name: 'roulette',
	alias: 'rlt'
};
