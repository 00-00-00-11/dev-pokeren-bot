const Discord = require('discord.js');
const config = require('../config.json');

module.exports.run = async (bot, message, args) => {
	let helpEmbed = new Discord.RichEmbed()
		.setTitle(`Brush Help - ${message.guild.name}`)
		.setColor('#00FF00')
		.setThumbnail('https://www.pokeren.nl/assets/Uploads/f018c5eefa/pokeren_logo-v2.png')
		.addField('!leaderboardhelp', 'Show how to use the leaderboard commands.')
		.addField('!chipcount', 'Show current chipcount.')
		.addField('!chipcount <name> <chips>', 'Update chipcount.')
		.addField('!chipcount clear <discord_id/tag>', 'Clear that users chipcount. (Admin only)')
		.addField('!chipcount set <discord_id/tag> <chips>', 'Set that users chipcount. (Admin only)')
		.addField('!chipcounts', 'Show top chipcounts.')
		.addField('!chipcounts clear', 'Clear all chipcounts. (Admin only)')
		.addField('!chipcounts title <title>', 'Add custom title to command.')
		.addField('!chipcounts removetitle', 'Remove custom title.')
		.addField('!totalchips', 'Show total chips and current chipleader in tournament.')
		.addField('!ft', 'Show total Final Table count.')
		.addField('!ft add', 'Add 1 to Final Table count.')
		.addField('!ft edit <number>', 'Change Final Table count to number. (Admin only)')
		.addField('!royal', 'Show total Royal Flush count.')
		.addField('!royal add', 'Add 1 to Royal Flush count.')
		.addField('!royal edit <number>', 'Change Royal Flush count to number. (Admin only)')
		.setTimestamp()
		.setFooter(`Brush Bot v${config.version} by Jan`);

	message.channel.send(helpEmbed);
};

module.exports.help = {
	name: 'help'
};
