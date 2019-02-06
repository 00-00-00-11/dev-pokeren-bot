const Highstake = require('../../models/leaderboard/highstakes');

// GET /discordUser
exports.get_all = (req, res, next) => {
	Highstake.find()
		.exec()
		.then((docs) => {
			res.status(200).json({
				highstake: docs
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
