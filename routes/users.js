/*
 * GET/POST settings page
 */

exports.users = function(params) {
	return function(req, res) {
	
        var infoLog = res.logger.logger.info;
        var warnLog = res.logger.logger.warning;
        var errLog = res.logger.logger.error;
	
		if ((!req.session.loggedIn) || (req.session.user.Role != 'Admin')) {
            errLog('User must be logged in and must be an admin to access to users management');
			res.redirect('/login');
            return false;
		}

        var email = req.session.user.Email;
		var saving = false;
		
		if (req.body.submit !== undefined) {
			if (req.params.idUser) {
				saving = true;
				// Hash password using bcrypt
				var bcrypt = require('bcrypt');
				var salt = bcrypt.genSaltSync(10);
				var hash = bcrypt.hashSync(req.body.password, salt);

				if (req.params.idUser == 'new') {
                    infoLog(email + ' is trying to create user : ' + req.body.name + ' with e-mail : ' + req.body.email + ' and role : ' + req.body.role);
					params.db('users').insert({
							Name: req.body.name,
							Email: req.body.email,
							Password: hash,
							Role: req.body.role
						}, 'id').exec(function(err, insertId){
							if (err !== null) {
								console.log(err);
                                errLog('Cannot insert user in database, redirect to users page');
                                errLog(err);
								res.redirect('/users');
							} else {
                                infoLog('User : ' + req.body.name + ' has been created by ' + email);
								res.redirect('/user/' + insertId);
							}
						});
				} else {
                    infoLog(email + ' is trying to update user : ' + req.body.name + ' with e-mail : ' + req.body.email);
					var info = {
						Name: req.body.name,
						Email: req.body.email,
						Role: req.body.role
					};

					if (req.body.password !== '') {
                        infoLog('Password modification for user : ' + req.body.name);
						info.Password = hash;
					}

					params.db('users').update(info)
						.where('id', req.params.idUser)
						.exec(function(err) {
                            if (err !== null) {
                                console.log(err);
                                errLog('Cannot update user in database, redirect to users page');
                                errLog(err);
                                res.redirect('/users');
                            } else {
                                infoLog('User : ' + req.body.name + ' has been updated by ' + email);
							    res.redirect('/user/' + req.params.idUser);
                            }
						});
				}
			}
		}

		if (req.body.delete !== undefined) {
            // FIXME : need to identify the user that will be deleted
            infoLog(email + ' is trying to delete a user');
			if (req.params.idUser) {
				saving = true;
				params.db('users').delete()
					.where('id', req.params.idUser)
					.exec(function(err) {
                        if (err !== null) {
                            console.log(err);
                            errLog('Cannot delete user in database, redirect to users page');
                            errLog(err);
                            res.redirect('/users');
                        } else {
                            infoLog('User : ' + req.body.name + ' has been deleted by ' + email);
                            res.redirect('/users');
                        }
					});
			}
		}

		if (saving === false) {
			var qry = params.db('users');

			if (req.params.idUser) {
				if (req.params.idUser == 'new') {
					res.render('edit_user', {
						title: 'Supervisord dashboard - Edit User',
						user: null,
						session: req.session
					});
				} else {
					qry.where('id', req.params.idUser)
						.exec(function(err, user){
							res.render('edit_user', {
								title: 'Supervisord dashboard - Edit User',
								user: user[0],
								session: req.session
							});
						});
				}
			} else {
				qry.exec(function(err, users){
					res.render('users', {
						title: 'Supervisord dashboard - Users',
						users: users,
						session: req.session
					});
				});
			}
		}
	};
};
