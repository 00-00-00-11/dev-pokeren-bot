const staffServer = process.env.POKEREN_STAFF_SERVER;
const mainServer = process.env.POKEREN_SERVER;
const Discord = require('discord.js');

module.exports = (bot, member) => {
	const g = bot.guilds.get(staffServer);
	const ch = g.channels.get('543382723952377856');
	if (member.guild.id !== mainServer) return;

	let avatar;
	if (member.user.avatarURL) {
		avatar = member.user.avatarURL;
	} else {
		avatar = '';
	}

	const leftEmbed = new Discord.RichEmbed()
		.setAuthor(`${member.user.tag} (${member.user.id})`, `${avatar}`)
		.setTimestamp()
		.setFooter('User left');

	ch.send(leftEmbed);
};
