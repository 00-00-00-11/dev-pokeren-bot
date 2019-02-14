const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
	if (message.channel.id !== '537750090677485598') return;

	const slots = [
		{ name: 'Banana', icon: '🍌', amount: 6 },
		{ name: 'Grapes', icon: '🍇', amount: 8 },
		{ name: 'Apple', icon: '🍎', amount: 10 },
		{ name: 'Cherries', icon: '🍒', amount: 12 },
		{ name: 'Strawberry', icon: '🍓', amount: 14 }
	];

	const result1 = Math.floor(Math.random() * slots.length);
	const result2 = Math.floor(Math.random() * slots.length);
	const result3 = Math.floor(Math.random() * slots.length);
	const playerIcon = message.author.displayAvatarURL;
	let amountWon;

	if (slots[result1] === slots[result2] && slots[result3]) {
		if (slots[result2].amount === slots[result3].amount) {
			amountWon = slots[result1].amount + slots[result2].amount + slots[result3].amount;
		} else {
			amountWon = slots[result1].amount + slots[result2].amount;
		}

		const winEmbed = new Discord.RichEmbed()
			.setTitle(`🎰 Slot Machine 🎰`)
			.addField(`Result:`, `${slots[result1].icon} ${slots[result2].icon} ${slots[result3].icon}`, true)
			.setTimestamp()
			.setFooter(`You won €${amountWon}!`, `${playerIcon}`)
			.setColor('#00ff00');

		message.channel.send(winEmbed);
	} else {
		const loseEmbed = new Discord.RichEmbed()
			.setTitle(`🎰 Slot Machine 🎰`)
			.addField(`Result:`, `${slots[result1].icon} ${slots[result2].icon} ${slots[result3].icon}`, true)
			.setTimestamp()
			.setFooter(`You lost!`, `${playerIcon}`)
			.setColor('#00ff00');

		message.channel.send(loseEmbed);
	}
};

module.exports.help = {
	name: 'slots'
};
