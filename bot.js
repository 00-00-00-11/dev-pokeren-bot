const config = require('./config.json');
const dotenv = require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client({ disableEveryone: true });
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL_1 + process.env.MONGODB_PASS + process.env.MONGODB_URL_2, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true
});
bot.commands = new Discord.Collection();

const DiscordUser = require('./models/discordUser');

fs.readdir('./commands', (err, files) => {
	if (err) console.log(err);

	let jsfile = files.filter((f) => f.split('.').pop() === 'js');
	if (jsfile.length <= 0) {
		console.log("Couldn't find commands.");
		return;
	}

	jsfile.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		console.log(`${f} loaded!`);
		bot.commands.set(props.help.name, props);
		if (props.help.alias) {
			bot.commands.set(props.help.alias, props);
		}
	});
});

fs.readdir('./commands/leaderboard', (err, files) => {
	if (err) console.log(err);

	let jsfile = files.filter((f) => f.split('.').pop() === 'js');
	if (jsfile.length <= 0) {
		console.log("Couldn't find commands.");
		return;
	}

	jsfile.forEach((f, i) => {
		let props = require(`./commands/leaderboard/${f}`);
		console.log(`${f} loaded!`);
		bot.commands.set(props.help.name, props);
		if (props.help.alias) {
			bot.commands.set(props.help.alias, props);
		}
	});
});

bot.on('ready', async () => {
	console.log(`${bot.user.username} is online!`);
	bot.user.setActivity('Poker');
});

bot.on('message', async (message) => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;

	let prefix = config.prefix;
	let messageArray = message.content.split(' ');
	let cmd = messageArray[0].toLowerCase();
	let args = messageArray.slice(1);

	if (message.content.startsWith(config.prefix)) {
		let commandfile = bot.commands.get(cmd.slice(prefix.length));
		if (commandfile) commandfile.run(bot, message, args);
	} else {
		// Add users
		DiscordUser.findOne(
			{
				username: message.author.username,
				user_id: message.author.id
			},
			(err, user) => {
				if (err) console.log(err);
				if (!user) {
					const discordUser = new DiscordUser({
						_id: mongoose.Types.ObjectId(),
						username: message.author.username,
						user_tag: message.author.tag,
						user_id: message.author.id,
						server_name: message.guild.name,
						server_id: message.guild.id,
						user_created: message.author.createdTimestamp
					});

					discordUser.save().catch((err) => console.log(err));
					console.log(`Added ${discordUser.username} to the database.`);
				} else {
					return;
				}
			}
		);
		// End add users
	}
});

bot.login(process.env.BOT_TOKEN);
