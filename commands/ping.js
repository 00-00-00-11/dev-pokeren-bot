const FTCount = require('../models/ft-counter.js');
const config = require('../config.json');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

module.exports.run = async (bot, message, args) => {
	return message.channel.send('Pong!');
};

module.exports.help = {
	name: 'ping'
};
