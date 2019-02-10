const staffServer = process.env.POKEREN_STAFF_SERVER;
const mainServer = process.env.POKEREN_SERVER;

module.exports = (bot, oldMember, newMember) => {
	const g = bot.guilds.get(staffServer);
	const ch = g.channels.get('543451473082581002');
	const oM = oldMember;
	const nM = newMember;
	if (oM.guild.id !== mainServer) return;

	if (oM.user.username !== nM.user.username || oM.user.discriminator !== nM.user.discriminator) {
		ch.send(
			`✏️ User **${oM.user.username}#${oM.user.discriminator}** changed username to **${nM.user.username}#${nM.user
				.discriminator}** (${nM.id})`
		);
	} else if (oM.nickname !== nM.nickname) {
		if (nM.nickname === null) {
			ch.send(`✏️ User **${oM.user.username}** removed his nickname (${nM.id})`);
		} else {
			ch.send(`✏️ User **${oM.user.tag}** changed nickname to \`${nM.nickname}\` (${nM.id})`);
		}
	}
};
