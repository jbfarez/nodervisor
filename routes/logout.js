/*
 * GET logout page
 */

exports.logout = function(params) {
	return function(req, res) {

        var infoLog = res.logger.logger.info;
        var warnLog = res.logger.logger.warning;
        var errLog = res.logger.logger.error;

        infoLog('Logging off \"' + req.session.user.Email + '\", redirect to /');
        req.session.destroy();
		res.redirect('/');
	};
};
