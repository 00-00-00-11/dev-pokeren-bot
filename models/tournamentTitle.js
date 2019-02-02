const mongoose = require('mongoose');

const tournamentTitleSchema = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		username: String,
		user_id: String,
		type: String,
		title: String,
		timestamp: String
	},
	{ versionKey: false }
);

module.exports = mongoose.model('TournamentTitle', tournamentTitleSchema);
