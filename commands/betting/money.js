const config = require('../../config.json');
const mongoose = require('mongoose');
const Money = require('../../models/betting/money');
const ms = require('parse-ms');

import { withCommas } from '../../lib/helpers';

function generateDaily(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

module.exports.run = async (bot, message, args) => {
  if (message.channel.id !== '537750090677485598') return;

  const cooldown = 43200000;

  if (args[0] === 'giveall') {
    // Only allow from permitted users
    if (!config.permittedUsers.includes(message.author.id)) return;
    if (!args[1]) return message.channel.send('Missing amount to give.');

    const givenAmount = args[1];

    Money.updateMany(
      {},
      {
        $inc: {
          money: givenAmount
        }
      },
      (err, updated) => {
        if (err) console.log(err);

        return message.channel.send(`Gave all users in database €${withCommas(givenAmount)}!`);
      }
    );
  } else if (args[0] === 'give') {
    const giveUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));
    const giveAmount = parseInt(args[2]);
    if (!giveUser) return message.channel.send('Missing or invalid user.');
    if (giveAmount <= 0) return message.channel.send("Can't give €0");
    if (!giveAmount) return message.channel.send('Missing amount.');
    if (message.author.id === giveUser.user.id) return message.channel.send("Can't give yourself money!");

    Money.findOneAndUpdate({ user_id: message.author.id }, { new: true }, (err, fromUser) => {
      if (err) console.log(err);
      if (!fromUser) {
        const newUser = new Money({
          _id: mongoose.Types.ObjectId(),
          username: message.author.username,
          user_id: message.author.id,
          server_name: message.guild.name,
          server_id: message.guild.id,
          money: 0,
          last_daily: null
        });
        newUser.save();
        return message.channel.send(`Not enough money. Use \`!money daily\` to get some.`);
      } else {
        Money.findOneAndUpdate({ user_id: giveUser.user.id }, { new: true }, (err, toUser) => {
          if (err) console.log(err);
          if (giveAmount > fromUser.money) return message.channel.send("Can't send more than you've got!");
          if (!toUser) {
            const newUser = new Money({
              _id: mongoose.Types.ObjectId(),
              username: giveUser.user.username,
              user_id: giveUser.user.id,
              server_name: message.guild.name,
              server_id: message.guild.id,
              money: 0 + giveAmount,
              last_daily: null
            });
            newUser.save();
            fromUser.money = fromUser.money - giveAmount;
            fromUser.save();
            return message.channel.send(`You sent €${giveAmount} to ${giveUser.user.username}.`);
          } else {
            toUser.money = toUser.money + giveAmount;
            toUser.save();
            fromUser.money = fromUser.money - giveAmount;
            fromUser.save();
            return message.channel.send(`You sent €${giveAmount} to ${giveUser.user.username}.`);
          }
        });
      }
    });
  } else if (args[0] === 'collect' || args[0] === 'daily') {
    const dailyAmount = generateDaily(200, 300);

    Money.findOneAndUpdate({ user_id: message.author.id }, { new: true }, (err, money) => {
      if (err) console.log(err);
      if (!money) {
        const newMoney = new Money({
          _id: mongoose.Types.ObjectId(),
          username: message.author.username,
          user_id: message.author.id,
          server_name: message.guild.name,
          server_id: message.guild.id,
          money: 0 + dailyAmount,
          last_daily: message.createdTimestamp
        });
        newMoney.save();
        return message.channel.send(`Money created with €${withCommas(dailyAmount)}.`);
      } else {
        const lastDaily = money.last_daily;

        if (cooldown - (Date.now() - lastDaily) > 0) {
          const timeObj = ms(cooldown - (Date.now() - lastDaily));
          return message.channel.send(`You already collected this, please wait ${timeObj.hours}h ${timeObj.minutes}m!`);
        } else {
          money.money = money.money + dailyAmount;
          money.last_daily = Date.now();
          money.save();
          return message.channel.send(`You received €${dailyAmount}.`);
        }
      }
    });
  } else {
    Money.findOne({ user_id: message.author.id }, (err, money) => {
      if (err) console.log(err);
      if (!money) {
        const newMoney = new Money({
          _id: mongoose.Types.ObjectId(),
          username: message.author.username,
          user_id: message.author.id,
          server_name: message.guild.name,
          server_id: message.guild.id,
          money: 0,
          last_daily: null
        });
        newMoney.save();
        message.channel.send(`Money created with €0. Use \`!money daily\` to get some.`);
      } else {
        return message.channel.send(`You have €${withCommas(money.money)}.`);
      }
    });
  }
};

module.exports.help = {
  name: 'money'
};
