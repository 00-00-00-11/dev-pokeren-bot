const staffServer = process.env.POKEREN_STAFF_SERVER;
const mainServer = process.env.POKEREN_SERVER;

module.exports = (bot, oldGuild, newGuild) => {
	const g = bot.guilds.get(staffServer);
	const ch = g.channels.get('543446264780554244');
	if (oldGuild.id !== mainServer) return;

	if (oldGuild.name !== newGuild.name) {
		ch.send(`⚙️ Server \`${oldGuild.name}\` was renamed to \`${newGuild.name}\` (${newGuild.id})`);
	}
};
