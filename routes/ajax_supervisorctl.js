/*
 * GET downloadctl page.
 */

exports.ajax_supervisorctl = function(params) {
	var config = params.config;
	var supervisordapi = params.supervisordapi;

	return function(req, res) {

        var infoLog = res.logger.logger.info;
        var warnLog = res.logger.logger.warning;
        var errLog = res.logger.logger.error;


		if (!req.session.loggedIn) {
			res.send({error: 'Not logged in'});
            errLog('Cannot interact with Supervisord, not logged in')
		} else {
            var email = req.session.user.Email;

			if (req.session.user.Role == 'Admin' || req.session.user.Role == 'Operator') {
				var host = req.param('host');
				var process = req.param('process');
				var action = req.param('action');

				if (config.hosts[host] !== undefined) {
					var supclient = supervisordapi.connect(config.hosts[host].Url);
					switch (action) {
						case 'stop': {
                            infoLog(email + ' trying to ' + action + ' process \"' + process + '\" on ' + host);
							supclient.stopProcessGroup(process, function(){
								res.send({result: 'success'});
                                infoLog('Process \"' + process + '\" on ' + host + ' ' + action + ' : success');
							});
						}
						break;
						case 'start': {
                            infoLog(email + ' trying to ' + action + ' process \"' + process + '\" on ' + host);
							supclient.startProcess(process, function(){
								res.send({result: 'success'});
                                infoLog('Process \"' + process + '\" on ' + host + ' ' + action + ' : success');
							});
						}
						break;
						case 'restartAll': {
                            if (req.session.user.Role != 'Admin') {
                                res.send({error: 'Incorrect Priviledges!'});
                                return false;
                            } else {
                                infoLog(email + ' trying to ' + action + ' process \"' + process + '\" on ' + host);
							    supclient.stopAllProcesses(true, function(){
								    supclient.startAllProcesses(true, function(){
									    res.send({result: 'success'});
                                        infoLog('Process \"' + process + '\" on ' + host + ' ' + action + ' : success');
								    });
							    });
                            }
						}
						break;
					}
				} else {
					res.send({result: 'error', message: 'Host not found'});
                    errLog('Cannot find Supervisord hosts')
				}
			} else {
				res.send({error: 'Incorrect priviledges !'});
                errLog('Incorrect privileges for \"' + email + '\"');
				return false;
			}
		}
	};
};
