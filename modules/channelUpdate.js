module.exports = function() {
	const dotenv = require('dotenv').config();
	const Discord = require('discord.js');
	const bot = new Discord.Client({ disableEveryone: true });
	const staffServer = process.env.POKEREN_STAFF_SERVER;
	const mainServer = process.env.POKEREN_SERVER;

	this.channelUpdateEvent = function(oldChannel, newChannel) {
		const g = bot.guilds.get(staffServer);
		const ch = g.channels.get('543446264780554244');
		if (oldChannel.guild.id !== mainServer) return;

		if (oldChannel.name !== newChannel.name) {
			ch.send('⚙️ Channel `' + oldChannel.name + '` (' + newChannel.id + ') was renamed to `' + newChannel.name + '`');
		}
	};
};
