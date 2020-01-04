module.exports.run = async (bot, message, args) => {
  return message.channel.send(`Current bot ping: ${Math.round(bot.ping)}ms`);
};

module.exports.help = {
  name: 'ping'
};
