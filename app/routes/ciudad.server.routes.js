'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/user.server.controller');
	var ciudad = require('../../app/controllers/ciudad.server.controller');

	// Pais Routes
	app.route('/api/ciudad')
		.get(ciudad.list)
		.post(ciudad.create);

	app.route('/api/ciudad/:ciudadId')
		.get(ciudad.read)
		.put(ciudad.update)
		.delete(ciudad.delete);

	// Finish by binding the Ciudad middleware
	app.param('ciudadId', ciudad.ciudadByID);
};
