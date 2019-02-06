const Discord = require('discord.js');
const config = require('../../config.json');

module.exports.run = async (bot, message, args) => {
	let helpEmbed = new Discord.RichEmbed()
		.setTitle(`Brush Leaderboard Help - ${message.guild.name}`)
		.setColor('#00FF00')
		.setThumbnail('https://www.pokeren.nl/assets/Uploads/f018c5eefa/pokeren_logo-v2.png')
		.setDescription(
			'This command will work for all stakes and leaderboards. Simply replace <stake> with either !microstakes, !lowstakes, !midstakes, !highstakes or !livescores\n\nA valid command will look like this:\n!midstakes add jaaneh PokerStars Big $109 $155.75 01/01/2000'
		)
		.addField('!<stake>', 'See top 3 microstake scores.')
		.addField(
			'!<stake> add <name> <client> <tournament> <prize> <date>',
			'Add score to microstakes database. (Admin only)'
		)
		.addField('!<stake> clear', 'Clear all microstake scores. (Admin only)')
		.setTimestamp()
		.setFooter(`Brush Bot v${config.version} by Jan`);

	message.channel.send(helpEmbed);
};

module.exports.help = {
	name: 'leaderboardhelp'
};
