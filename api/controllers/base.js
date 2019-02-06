// GET /
exports.get_all = (req, res, next) => {
	res.status(200).json({
		'/discordUsers': {
			'/': 'Returns a list of all users currently in database.',
			'/:user_id': 'Returns information for that user.'
		},
		'/ftCounter': {
			'/:server_id': 'Returns counter for that server.'
		},
		'/royalCounter': {
			'/:server_id': 'Returns counter for that server.'
		},
		'/chipcounts': {
			'/': 'Returns chipcounts of all users currently in database.',
			'/:user_id': 'Returns chipcount for that user.'
		}
	});
};
