var LocalStrategy = require('passport-local').Strategy;
var User = require('../models').User;

module.exports = function(passport) {
	// Passport session setup.
	// To support persistent login sessions, Passport needs to be able to
	// serialize users into and deserialize users out of the session.  Typically,
	// this will be as simple as storing the user ID when serializing, and finding
	// the user by ID when deserializing.
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});

	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done) {
			// asynchronous verification, for effect...
			process.nextTick(function() {
				// Find user with the given email. If user does not found or
				// the password does not match users password false is returned.
				// If successfull user object is returned.
				//
				User.find({
					where: {
						email: email
					}
				}).then(function(user) {
					if (!user) {
						return done(null, false, {
							message: req.flash('loginMessage', 'Invalid email or password.')
						});
					} else {
						user.verifyPassword(password, function(err, res) {
							if (res) {
								return done(null, user);
							} else {
								return done(null, false, {
									message: req.flash('loginMessage', 'Invalid email or password.')
								});
							}
						});
					}
				});
			})
		}
	));

}