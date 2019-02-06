const Microstake = require('../../models/leaderboard/microstakes');

// GET /discordUser
exports.get_all = (req, res, next) => {
	Microstake.find()
		.exec()
		.then((docs) => {
			res.status(200).json({
				microstakes: docs
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
