'use strict';

module.exports = function(app) {
	//var users = require('../../app/controllers/users.server.controller');
	var locations = require('../../app/controllers/locations.server.controller');

	// Locations Routes
	app.route('/locations')
		.get(locations.list)
		.post(locations.create);

	app.route('/locations/:locationId')
		.get(locations.read)
		.put(locations.update)
		.delete(locations.delete);

    app.route('/locations/getList')
	   .post(locations.getList);

	// Finish by binding the Location middleware
	app.param('locationId', locations.locationsByID);
};
