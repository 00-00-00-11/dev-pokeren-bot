const Midstake = require('../../models/leaderboard/midstakes');

// GET /discordUser
exports.get_all = (req, res, next) => {
	Midstake.find()
		.exec()
		.then((docs) => {
			res.status(200).json({
				midstakes: docs
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
