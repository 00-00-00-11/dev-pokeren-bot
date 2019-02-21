const Money = require('../../models/betting/money');

// GET /money
exports.money_get_all = (req, res, next) => {
	Money.find()
		.exec()
		.then((docs) => {
			res.status(200).json({
				all_users: docs
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

// GET /money/:userId
exports.money_get_user = (req, res, next) => {
	const userId = req.params.userId;
	Money.find({ user_id: userId })
		.exec()
		.then((doc) => {
			res.status(200).json({
				user: doc
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
