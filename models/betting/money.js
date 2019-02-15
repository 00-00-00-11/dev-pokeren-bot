const mongoose = require('mongoose');

const moneySchema = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		username: String,
		user_id: String,
		server_name: String,
		server_id: String,
		money: Number,
		last_daily: Number
	},
	{ versionKey: false }
);

module.exports = mongoose.model('Money', moneySchema);
