'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Maintain = mongoose.model('Maintain');

/**
 * Create a Maintain
 */
exports.create = function(req, res) {
	var maintain = new Maintain(req.body);
	maintain.user = req.user;

	maintain.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(maintain);
		}
	});
};

/**
 * Show the current Maintain
 */
exports.read = function(req, res) {
	res.jsonp(req.maintain);
};

/**
 * Update a Maintain
 */
exports.update = function(req, res) {
	var maintain = req.maintain ;
	    maintain.name = req.body.name;
	    maintain.code = req.body.code;
	    maintain.desc = req.body.desc;

	maintain.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(maintain);
		}
	});
};

/**
 * Delete an Maintain
 */
exports.delete = function(req, res) {
	var maintain = req.maintain ;

	maintain.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(maintain);
		}
	});
};

/**
 * List of Maintains
 */
exports.getList = function(req, res) { 
	Maintain.find().sort('-created').populate('user', 'displayName').exec(function(err, maintains) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(maintains);
		}
	});
};

exports.list = function(req, res){
    var count = req.query.count || 5;
    var page = req.query.page || 1;
   
    var filter = {
     	filters: {
     		mandatory: {
     			contains: req.query.filter
     		}
     	}
     };

     var pagination = {
     	start : (page - 1) * count,
     	count : count
     };

     var sort ={
     	sort: {
     		desc: '_id'
     	}
     };
    
    Maintain
    .find()
    .filter(filter)
    .order(sort)
    .page(pagination, function(err, maintain){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(maintain);
		}
    });

};

exports.getByCode = function(req, res) { 
  var codereq = req.body.mCode;
  Maintain.find({name: codereq}).exec(function(err, maintains) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(maintains);
		}
	});
};


exports.getHeaderByCode = function(req, res) { 
  var maintainsId = req.body.maintainsId;
  Maintain.find({maintainId: maintainsId}).exec(function(err, maintains) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(maintains);
		}
	});
};

/**
 * Maintain middleware
 */
exports.maintainByID = function(req, res, next, id) { 
	Maintain.findById(id).populate('user', 'displayName').exec(function(err, maintain) {
		if (err) return next(err);
		if (! maintain) return next(new Error('Failed to load Maintain ' + id));
		req.maintain = maintain ;
		next();
	});
};

/**
 * Maintain authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.maintain.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
