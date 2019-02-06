const RoyalCount = require('../../models/royal-counter');

// GET /royalCounter
exports.counters = (req, res, next) => {
	res.status(404).json({
		error: {
			message: 'Missing server ID in URL - Please specify it like this: /royalCounter/<server_id>'
		}
	});
};

// GET /royalCounter/:serverId
exports.counters_get_server = (req, res, next) => {
	const serverId = req.params.serverId;
	RoyalCount.find({ server_id: serverId })
		.exec()
		.then((doc) => {
			res.status(200).json({
				royal_counter: doc
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
