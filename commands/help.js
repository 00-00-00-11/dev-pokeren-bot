const Discord = require('discord.js');
const config = require('../config.json');

module.exports.run = async (bot, message, args) => {
	let helpEmbed = new Discord.RichEmbed()
		.setTitle(`Brush Help - ${message.guild.name}`)
		.setColor('#00FF00')
		.setThumbnail('https://www.pokeren.nl/assets/Uploads/f018c5eefa/pokeren_logo-v2.png')
		.addField('!chipcount', 'Show current chipcount.')
		.addField('!chipcount <name> <chips>', 'Update chipcount.')
		.addField('!chipcount clear', 'Clear all chipcounts. (Admin only)')
		.addField('!chipcounts', 'Show top chipcounts.')
		.addField('!chipcounts title <title>', 'Add custom title to command.')
		.addField('!chipcounts removetitle', 'Remove custom title.')
		.addField('!ft', 'Show total Final Table count.')
		.addField('!ft add', 'Add 1 to Final Table count.')
		.addField('!ft edit <number>', 'Change Final Table count to number. (Admin only)')
		.addField('!royal', 'Show total Royal Flush count.')
		.addField('!royal add', 'Add 1 to Royal Flush count.')
		.addField('!royal edit <number>', 'Change Royal Flush count to number. (Admin only)')
		.addField('!microstakes', 'See top 3 microstake scores.')
		.addField(
			'!microstakes add <name> <client> <tournament> <prize> <date>',
			'Add score to microstakes database. (Admin only)'
		)
		.addField('!lowstakes', 'See top 3 lowstake scores.')
		.addField(
			'!lowstakes add <name> <client> <tournament> <prize> <date>',
			'Add score to lowstakes database. (Admin only)'
		)
		.addField('!midstakes', 'See top 3 midstakes scores.')
		.addField(
			'!midstakes add <name> <client> <tournament> <prize> <date>',
			'Add score to midstakes database. (Admin only)'
		)
		.addField('!highstakes', 'See top 3 highstake scores.')
		.addField(
			'!highstakes add <name> <client> <tournament> <prize> <date>',
			'Add score to highstakes database. (Admin only)'
		)
		.addField('!livescores (alias !livetop3)', 'See top 3 live scores.')
		.addField(
			'!livescores add <name> <client> <tournament> <prize> <date>',
			'Add score to livescores database. (Admin only)'
		)
		.setTimestamp()
		.setFooter(`Brush Bot v${config.version} by Jan`);

	message.channel.send(helpEmbed);
};

module.exports.help = {
	name: 'help'
};
