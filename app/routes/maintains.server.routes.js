'use strict';

module.exports = function(app) {
	//var users = require('../../app/controllers/users.server.controller');
	var maintains = require('../../app/controllers/maintains.server.controller');

	// Maintains Routes
	app.route('/maintains')
		.get(maintains.list)
		.post(maintains.create);

	app.route('/maintains/:maintainId')
		.get(maintains.read)
		.put(maintains.update)
		.delete(maintains.delete);

	app.route('/api/maintains/getBycode')
	    .post(maintains.getByCode);

	app.route('/api/maintains/getHeaderByCode')
	    .post(maintains.getHeaderByCode);

	app.route('/api/getList')
	    .get(maintains.getList);
	// Finish by binding the Maintain middleware
	app.param('maintainId', maintains.maintainByID);
};
