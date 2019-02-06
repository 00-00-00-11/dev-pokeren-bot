const mongoose = require('mongoose');

const topMicrostakes = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		player_name: String,
		poker_client: String,
		tournament_name: String,
		winnings: Number,
		date_won: String,
		stake: String,
		timestamp_added: String
	},
	{ versionKey: false }
);

module.exports = mongoose.model('topMicrostake', topMicrostakes);
