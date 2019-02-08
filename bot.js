const config = require('./config.json');
const dotenv = require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client({ disableEveryone: true });
const mongoose = require('mongoose');
const DiscordUser = require('./models/discordUser');
const staffServer = process.env.POKEREN_STAFF_SERVER;

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
bot.commands = new Discord.Collection();

Number.prototype.padLeft = function(base, chr) {
	var len = String(base || 10).length - String(this).length + 1;
	return len > 0 ? new Array(len).join(chr || '0') + this : this;
};

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

// Events
bot.on('guildMemberAdd', async (member) => {
	const g = bot.guilds.get(staffServer);
	const m = g.member(member);
	const joinedAt = m.joinedTimestamp;
	const ch = g.channels.get('543382695984496640');

	let d = new Date(joinedAt);
	let dformat =
		[ (d.getMonth() + 1).padLeft(), d.getDate().padLeft(), d.getFullYear() ].join('/') +
		' ' +
		[ d.getHours().padLeft(), d.getMinutes().padLeft(), d.getSeconds().padLeft() ].join(':');

	ch.send(`👋 **${member.user.tag}** (${member.user.id}) joined the server. (Joined ${dformat})`);
});

bot.on('guildMemberRemove', async (member) => {
	const g = bot.guilds.get(staffServer);
	const m = g.member(member);
	const joinedAt = m.joinedTimestamp;
	const ch = g.channels.get('543382723952377856');

	let d = new Date(joinedAt);
	let dformat =
		[ (d.getMonth() + 1).padLeft(), d.getDate().padLeft(), d.getFullYear() ].join('/') +
		' ' +
		[ d.getHours().padLeft(), d.getMinutes().padLeft(), d.getSeconds().padLeft() ].join(':');

	ch.send(`👋 **${member.user.tag}** (${member.user.id}) left the server. (Joined ${dformat})`);
});

bot.on('channelCreate', async (channel) => {
	const g = bot.guilds.get(staffServer);
	const ch = g.channels.get('543446264780554244');

	ch.send(`✏️ Channel **${channel.name}** (${channel.id}) was created.`);
});

bot.on('channelDelete', async (channel) => {
	const g = bot.guilds.get(staffServer);
	const ch = g.channels.get('543446264780554244');

	ch.send(`✏️ Channel **${channel.name}** (${channel.id}) was deleted.`);
});

bot.on('channelUpdate', async (oldChannel, newChannel) => {
	const g = bot.guilds.get(staffServer);
	const ch = g.channels.get('543446264780554244');

	ch.send(`⚙️ Channel **${oldChannel.name}** was renamed to **${newChannel.name}**. (${newChannel.id})`);
});

bot.on('guildMemberUpdate', async (oldMember, newMember) => {
	const g = bot.guilds.get(staffServer);
	const ch = g.channels.get('543451473082581002');

	if (oldMember.user.username !== newMember.user.username) {
		ch.send(`✏️ User **${oldMember.user.username}** changed username to **${newMember.username}**. (${newMember.id})`);
	} else if (oldMember.nickname !== newMember.nickname) {
		if (newMember.nickname === null) {
			ch.send(`✏️ User **${oldMember.user.username}** removed his nickname. (${newMember.id})`);
		} else {
			ch.send(`✏️ User **${oldMember.user.tag}** changed nickname to **${newMember.nickname}**. (${newMember.id})`);
		}
	}
});

bot.on('guildUpdate', async (oldGuild, newGuild) => {
	const g = bot.guilds.get(staffServer);
	const ch = g.channels.get('543446264780554244');

	if (oldGuild.name !== newGuild.name) {
		ch.send(`⚙️ Guild **${oldGuild.name}** was renamed to **${newGuild.name}**. (${newGuild.id})`);
	}
});
// End events

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
				} else {
					return;
				}
			}
		);
		// End add users
	}
});

bot.login(process.env.BOT_TOKEN);
