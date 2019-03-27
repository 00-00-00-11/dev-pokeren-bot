const Discord = require('discord.js');
const Money = require('../../models/betting/money');

function numberWithCommas(number) {
	var parts = number.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

module.exports.run = async (bot, message, args) => {
	if (message.channel.id !== '537750090677485598') return message.channel.send('Only available in <#537750090677485598>');

	const slots = [
		{ name: 'Banana', icon: '🍌', amount: 1 }, // Wins 2x or 3x
		{ name: 'Grapes', icon: '🍇', amount: 2 }, // Wins 4x or 6x
		{ name: 'Apple', icon: '🍎', amount: 3 }, // Wins 6x or 9x
		{ name: 'Cherries', icon: '🍒', amount: 4 }, // Wins 8x or 12x
		{ name: 'Strawberry', icon: '🍓', amount: 5 } // Wins 10x or 15x
	];

	Money.findOne({ user_id: message.author.id }, (err, money) => {
		if (err) console.log(err);
		if (!money) {
			return message.channel.send("You don't have any money! Use `!money daily` to get some.");
		} else {
			const result1 = Math.floor(Math.random() * slots.length);
			const result2 = Math.floor(Math.random() * slots.length);
			const result3 = Math.floor(Math.random() * slots.length);
			const playerIcon = message.author.displayAvatarURL;
			const amountBet = args[0];
			let amountWon;

			if (!amountBet) return message.channel.send('Missing bet amount. `!slots <bet>`');
			if (isNaN(amountBet)) return message.channel.send('Invalid bet amount.');
			if (amountBet <= 0) return message.channel.send("Can't bet €0");
			if (money.money == 0) return message.channel.send('You have €0. Use `!money daily` to get some.');
			if (amountBet > money.money) return message.channel.send("Can't bet more than you've got!");
			if (amountBet > 5000) return message.channel.send('Max bet is €5,000!');

			if (slots[result1] === slots[result2] && slots[result3]) {
				if (slots[result2].amount === slots[result3].amount) {
					amountWon = slots[result1].amount + slots[result2].amount + slots[result3].amount;
				} else {
					amountWon = slots[result1].amount + slots[result2].amount;
				}

				amountWon = amountWon * amountBet;

				const winEmbed = new Discord.RichEmbed()
					.setTitle(`🎰 Slot Machine 🎰`)
					.addField(`Result:`, `${slots[result1].icon} ${slots[result2].icon} ${slots[result3].icon}`, true)
					.setTimestamp()
					.setFooter(`You won €${numberWithCommas(amountWon)}!`, `${playerIcon}`)
					.setColor('#00ff00');

				money.money = money.money - amountBet + amountWon;
				money.save();
				return message.channel.send(winEmbed);
			} else {
				const loseEmbed = new Discord.RichEmbed()
					.setTitle(`🎰 Slot Machine 🎰`)
					.addField(`Result:`, `${slots[result1].icon} ${slots[result2].icon} ${slots[result3].icon}`, true)
					.setTimestamp()
					.setFooter(`You lost €${numberWithCommas(amountBet)}!`, `${playerIcon}`)
					.setColor('#00ff00');

				money.money = money.money - amountBet;
				money.save();
				return message.channel.send(loseEmbed);
			}
		}
	});
};

module.exports.help = {
	name: 'slots'
};
