var models = require('../models');
var express = require('express');
var router = express.Router();
var moment = require('moment');

router
/* GET users listing. */
	.get('/', function(req, res, next) {
		models.User.findAll().then(function(users) {
			res.render('users/index', {
				title: 'Express',
				users: users,
				moment: moment
			});
		});
	})
	/* Create a User */
	.post('/', function(req, res, next) {
		models.User.create({
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName
		}).then(function() {
			res.redirect('/users');
		});
	})
	/* Render new form to create user */
	.get('/new', function(req, res, next) {
		res.render('users/new')
	})
	/* Render edit form to update user */
	.get('/:id/edit', function(req, res, next) {
		models.User.find({
			where: {
				id: req.params.id
			}
		}).then(function(user) {
			res.render('users/edit', {
				user: user.dataValues
			})
		});
	})
	/* Update user */
	.post('/:id/update', function(req, res, next) {
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
	.get('/:id/delete', function(req, res, next) {
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