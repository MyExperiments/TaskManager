var models = require('../models');
var express = require('express');
var router = express.Router();
var moment = require('moment');

var ensureAuthenicated = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login')
}
router
/* GET users listing. */
	.get('/', ensureAuthenicated, function(req, res, next) {
		models.User.findAll().then(function(users) {
			res.render('users/index', {
				title: 'Express',
				users: users,
				moment: moment,
				tab: 'users'
			});
		});
	})
	/* Create a User */
	.post('/', ensureAuthenicated, function(req, res, next) {
		var user = models.User;
		user.setPassword('user@123$%^', function(err, password) {
			if (err) return done(err);
			user.create({
				email: req.body.email,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				password: password
			}).then(function() {
				res.redirect('/users');
			});
		});
	})

/* Render new form to create user */
.get('/new', ensureAuthenicated, function(req, res, next) {
		res.render('users/new', {
			tab: 'users'
		});

	})
	/* Render edit form to update user */
	.get('/:id/edit', ensureAuthenicated, function(req, res, next) {
		models.User.find({
			where: {
				id: req.params.id
			}
		}).then(function(user) {
			res.render('users/edit', {
				user: user.dataValues,
				tab: 'users'
			})
		});
	})
	/* Update user */
	.post('/:id/update', ensureAuthenicated, function(req, res, next) {
		models.User.find({
			where: {
				id: req.params.id
			}
		}).then(function(user) {
			user.update({
				email: req.body.email,
				firstName: req.body.firstName,
				lastName: req.body.lastName
			}).then(function() {
				res.redirect('/users');
			});
		});
	})
	/* Delete User*/
	.get('/:id/delete', ensureAuthenicated, function(req, res, next) {
		models.User.find({
			where: {
				id: req.params.id
			}
		}).then(function(user) {
			user.destroy().then(function() {
				res.redirect('/users');
			});
		});
	});

module.exports = router;