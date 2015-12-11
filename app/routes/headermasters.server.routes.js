'use strict';

module.exports = function(app) {
	//var users = require('../../app/controllers/users.server.controller');
	var headermasters = require('../../app/controllers/headermasters.server.controller');

	// Headermasters Routes
	app.route('/headermasters')
		.get(headermasters.list)
		.post(headermasters.create);

    app.route('/api/headermasters/listByHeader')
        .post(headermasters.listByHeader);

	app.route('/headermasters/:headermasterId')
		.get(headermasters.read)
		//.put(users.requiresLogin, headermasters.hasAuthorization, headermasters.update)
		.put(headermasters.update)
		.delete(headermasters.delete);

	// Finish by binding the Headermaster middleware
	app.param('headermasterId', headermasters.headermasterByID);
};
