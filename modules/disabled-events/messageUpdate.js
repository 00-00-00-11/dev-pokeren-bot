const staffServer = process.env.POKEREN_STAFF_SERVER;
const mainServer = process.env.POKEREN_SERVER;

module.exports = (bot, oldMessage, newMessage) => {
	const g = bot.guilds.get(staffServer);
	const ch = g.channels.get('543707440907288589');
	const user = newMessage.member.user;
	if (oldMessage.member.user.bot) return;
	//if (oldMessage.guild.id !== mainServer) return;

	if (oldMessage.content !== newMessage.content) {
		ch.send(
			`💬 **${user.username}#${user.discriminator}** (${user.id}) changed the message \`${oldMessage.content}\` to \`${newMessage.content}\` in <#${newMessage
				.channel.id}>`
		);
	}
};
