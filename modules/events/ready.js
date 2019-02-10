module.exports = (bot) => {
	console.log(`${bot.user.username} is online!`);
	bot.user.setActivity('Poker');
};
