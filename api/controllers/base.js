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
		},
		'/microstakes': {
			'/': 'Returns all microstake scores currently in database.'
		},
		'/lowstakes': {
			'/': 'Returns all lowstake scores currently in database.'
		},
		'/midstakes': {
			'/': 'Returns all midstake scores currently in database.'
		},
		'/highstakes': {
			'/': 'Returns all highstakes scores currently in database.'
		},
		'/livescores': {
			'/': 'Returns all livescore scores currently in database.'
		}
	});
};
