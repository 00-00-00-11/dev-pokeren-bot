const staffServer = process.env.POKEREN_STAFF_SERVER;
const mainServer = process.env.POKEREN_SERVER;

module.exports = (bot, oldChannel, newChannel) => {
	const g = bot.guilds.get(staffServer);
	const ch = g.channels.get('543446264780554244');
	// if (oldChannel.guild.id !== mainServer) return;

	if (oldChannel.name !== newChannel.name) {
		ch.send(`⚙️ Channel \`${oldChannel.name}\` (${oldChannel.id}) was renamed to \`${newChannel.name}\``);
	}
};
