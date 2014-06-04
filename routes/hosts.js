/*
 * GET/POST hosts page
 */

exports.hosts = function(params) {
	var config = params.config;
	var db = params.db;
	return function(req, res) {

        var infoLog = res.logger.logger.info;
        var warnLog = res.logger.logger.warning;
        var errLog = res.logger.logger.error;

		if ((!req.session.loggedIn) || (req.session.user.Role != 'Admin')) {
            errLog('User must be logged in and must be an admin to access to hosts management');
			res.redirect('/login');
            return false;
		}

        var email = req.session.user.Email;
		var saved = false;
		var hosts = params.config.hosts;
		
		if (req.body.submit !== undefined) {
			var newHosts = [];
			if (req.body.host !== undefined) {
				// Using the posted data to actually construct the data objects to pass to db writes.
				// Because its easier this way. (and it used to be stored in json file)
				if (req.body.host.idHost instanceof Array) {
					for (var i = 0; i < req.body.host.idHost.length; i++) {
						newHosts.push({
							idHost: req.body.host.idHost[i],
							Name: req.body.host.Name[i],
							Url: req.body.host.Url[i],
							relatedLink: req.body.host.RelatedLink[i]
						});
					}
				} else {
					newHosts.push({
						idHost: req.body.host.idHost,
						Name: req.body.host.Name,
						Url: req.body.host.Url,
						relatedLink: req.body.host.RelatedLink
					});
				}
			}

			// Save and render
			params.config.writeHosts(db, newHosts, function(err){
				if (!err){
                    infoLog('New host created by ' + email);
					saved = true;
				}
				res.render('hosts', {
					title: 'Supervisord dashboard - Hosts',
					hosts: params.config.hosts,
					saved: saved,
					error: err,
					session: req.session
				});
			});
		} else {
			res.render('hosts', {
				title: 'Supervisord dashboard - Hosts',
				hosts: hosts,
				saved: saved,
				error: null,
				session: req.session
			});
		}
	};
};
