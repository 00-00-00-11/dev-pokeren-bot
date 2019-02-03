const FTCount = require('../../models/ftCount');

// GET /counters
exports.counters = (req, res, next) => {
	res.status(404).json({
		error: {
			message: 'Missing server ID in URL - Please specify it like this: /ftCounter/<server_id>'
		}
	});
};

// GET /counters/:serverId
exports.counters_get_server = (req, res, next) => {
	const serverId = req.params.serverId;
	FTCount.find({ server_id: serverId })
		.exec()
		.then((doc) => {
			res.status(200).json({
				ft_counter: doc
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};
