function authenticate(dbAuthenticate) {
	return function authHandler(req, res, next) {
		console.log('Auth is being executed');
		var username = req.body.username;
		var password = req.body.password;

		dbAuthenticate(username, password, function dbAuthCallback(err, rslt) {
			if(!err) {
				req.session.org_id = rslt.org_id;
				req.session.user_id = rslt.user_id;

				next();
			}
			else {
				next(new Error('User authentication failed'));
			}
		});
	}
}

exports.authenticate = authenticate;