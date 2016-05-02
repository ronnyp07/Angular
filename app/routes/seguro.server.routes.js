'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/user.server.controller');
	var pais = require('../../app/controllers/pais.server.min.js');

	// Pais Routes
	app.route('/api/pais')
		.get(pais.list)
		.post(pais.create);

	app.route('/api/pais/:paisId')
		.get(pais.read)
		.put(pais.update)
		.delete(pais.delete);

	// Finish by binding the Pai middleware
	app.param('paisId', pais.paisByID);
};
