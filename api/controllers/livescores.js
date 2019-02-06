const Livescore = require('../../models/leaderboard/livescores');

// GET /discordUser
exports.get_all = (req, res, next) => {
	Livescore.find()
		.exec()
		.then((docs) => {
			res.status(200).json({
				livescores: docs
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
