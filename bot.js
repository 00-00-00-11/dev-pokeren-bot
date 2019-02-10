const dotenv = require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client({ disableEveryone: true });

bot.commands = new Discord.Collection();

// Load commands
const generalCommands = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
const lbCommands = fs.readdirSync('./commands/leaderboard').filter((file) => file.endsWith('.js'));

for (const file of generalCommands) {
	const props = require(`./commands/${file}`);
	console.log(`${file} loaded!`);
	bot.commands.set(props.help.name, props);
	if (props.help.alias) {
		bot.commands.set(props.help.alias, props);
	}
}

for (const file of lbCommands) {
	const props = require(`./commands/leaderboard/${file}`);
	console.log(`${file} loaded!`);
	bot.commands.set(props.help.name, props);
	if (props.help.alias) {
		bot.commands.set(props.help.alias, props);
	}
}
// End load commands

// Event listener
fs.readdir('./modules/events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach((file) => {
		if (!file.endsWith('.js')) return;

		const event = require(`./modules/events/${file}`);
		let eventName = file.split('.')[0];

		bot.on(eventName, event.bind(null, bot));
	});
});
// End event listener

bot.login(process.env.BOT_TOKEN);
