const Lowstake = require('../../models/leaderboard/lowstakes');

// GET /discordUser
exports.get_all = (req, res, next) => {
	Lowstake.find()
		.exec()
		.then((docs) => {
			res.status(200).json({
				lowstakes: docs
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
