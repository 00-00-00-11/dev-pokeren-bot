const staffServer = process.env.POKEREN_STAFF_SERVER;
const mainServer = process.env.POKEREN_SERVER;

module.exports = (bot, message) => {
	const g = bot.guilds.get(staffServer);
	const ch = g.channels.get('543707440907288589');
	if (message.member.user.bot) return;
	if (message.guild.id !== mainServer) return;

	if (message.content.length >= 1) {
		ch.send(`💬 Message \`${message.content}\` was deleted from <#${message.channel.id}> `);
	}
};
