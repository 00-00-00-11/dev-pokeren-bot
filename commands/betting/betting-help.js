const Discord = require('discord.js');
const config = require('../../config.json');

module.exports.run = async (bot, message, args) => {
	let helpEmbed = new Discord.RichEmbed()
		.setTitle(`Brush Betting Help - ${message.guild.name}`)
		.setColor('#00FF00')
		.setThumbnail('https://www.pokeren.nl/assets/Uploads/f018c5eefa/pokeren_logo-v2.png')
		.addField('!slots', 'Spin the slot machine.')
		.addField('!roulette <number> <bet>', 'Bet on a roulette number.')
		.addField('!roulette <color> <bet>', 'Bet on a roulette color.')
		.setTimestamp()
		.setFooter(`Brush Bot v${config.version} by Jan`);

	message.channel.send(helpEmbed);
};

module.exports.help = {
	name: 'bettinghelp',
	alias: 'bethelp'
};
