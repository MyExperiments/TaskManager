var express = require('express');
var router = express.Router();
var passport = require('passport');

require('../config/passport')(passport);

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express',
		message: 'Welcome to'
	});
});

// GET#login
router.get('/login', function(req, res) {
	res.render('sessions/login', {
		user: req.user,
		message: req.flash('loginMessage')
	});
});

// POST#login
router.post('/login',
	passport.authenticate('local', {
		successRedirect: '/users',
		failureRedirect: '/login',
		failureFlash: true
	})
);

// GET#logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});


module.exports = router;