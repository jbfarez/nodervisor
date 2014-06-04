/*
 * GET/POST login page
 */

exports.login = function(params) {
	return function(req, res) {
	    
        var infoLog = res.logger.logger.info;
        var warnLog = res.logger.logger.warning;
        var errLog = res.logger.logger.error;

		if (req.session.loggedIn) {
			res.redirect('/');
            infoLog('Access to /login. The user \"' + req.session.user.Email + '\" is already logged in, redirect to /');
		}

		if (req.body.email && req.body.password) {
			var email = req.body.email;
            var address = req._remoteAddress;
		    params.db('users')
		    	.where('Email', email)
		    	.exec(function(err, user){
		    		var error = 'Email/Password failed';
		    		if (user.length > 0) {
		    			bcrypt = require('bcrypt');
		    			req.session.loggedIn = bcrypt.compareSync(req.body.password, user[0].Password);
		    		} else {
		    			error = 'User \"' + email + '\" does not exists';
                        errLog(error);
                        return false;
		    		}
		    		
		    		if (!req.session.loggedIn) {
		    			res.render('login', {
		    				title: 'Supervisord dashboard - Login',
		    				error: error
		    			});
                        errLog(error + ' for user \"' + email + '\"');
                        return false;
		    		} else {
		    			req.session.user = user[0];
		    			res.redirect('/');
                        infoLog('Access granted for \"' + email + '\" from ' + address);
		    		}
		    	});
		} else {
			res.render('login', {
				title: 'Supervisord dashboard - Login',
				session: req.session,
			});
		}
	};
};
