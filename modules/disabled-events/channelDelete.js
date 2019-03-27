const staffServer = process.env.POKEREN_STAFF_SERVER;
const mainServer = process.env.POKEREN_SERVER;

module.exports = (bot, channel) => {
	const g = bot.guilds.get(staffServer);
	const ch = g.channels.get('543446264780554244');
	if (channel.guild.id !== mainServer) return;

	ch.send(`✏️ Channel \`${channel.name}\` (${channel.id}) was deleted.`);
};
