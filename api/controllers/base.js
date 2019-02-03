// GET /
exports.get_all = (req, res, next) => {
	res.status(200).json({
		'/bans': {
			'/': 'Returns a list of all bans.',
			'/:user_id': 'Returns all bans for that user.'
		},
		'/kicks': {
			'/': 'Returns a list of all kicks.',
			'/:user_id': 'Returns all kicks for that user.'
		},
		'/tempmutes': {
			'/': 'Returns a list of all tempmutes.',
			'/:user_id': 'Return all tempmutes for that user.'
		},
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
