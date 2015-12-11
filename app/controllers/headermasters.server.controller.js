'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Headermaster = mongoose.model('Headermaster');

/**
 * Create a Headermaster
 */
exports.create = function(req, res) {
	var headermaster = new Headermaster(req.body);
	headermaster.user = req.user;

	headermaster.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(headermaster);
		}
	});
};

/**
 * Show the current Headermaster
 */
exports.read = function(req, res) {
	res.jsonp(req.headermaster);
};

/**
 * Update a Headermaster
 */
exports.update = function(req, res) {
	var headermaster = req.headermaster ;
        headermaster.code = req.body.code;
        headermaster.value = req.body.value;
        headermaster.description = req.body.description;
        headermaster.updateUser = req.body.updateUser;
	

	headermaster.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(headermaster);
		}
	});
};

/**
 * Delete an Headermaster
 */
exports.delete = function(req, res) {
	var headermaster = req.headermaster ;

	headermaster.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(headermaster);
		}
	});
};

/**
 * List of Headermasters
 */
exports.list = function(req, res) { 
	Headermaster.find().sort('-created')
	.populate('user', 'displayName')
    .populate('maintainParent')
	.exec(function(err, headermasters) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(headermasters);
		}
	});
};

/**
 * List of Headermasters
 */
exports.listByHeader = function(req, res) {
	Headermaster
	.find({maintainParent: req.body.params})
	.sort('-created')
	.populate('user', 'displayName')
	.populate('maintainParent')
	.exec(function(err, headermasters) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(headermasters);
		}
	});
};



/**
 * Headermaster middleware
 */
exports.headermasterByID = function(req, res, next, id) { 
	Headermaster.findById(id).populate('user', 'displayName').exec(function(err, headermaster) {
		if (err) return next(err);
		if (! headermaster) return next(new Error('Failed to load Headermaster ' + id));
		req.headermaster = headermaster ;
		next();
	});
};

/**
 * Headermaster authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.headermaster.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
