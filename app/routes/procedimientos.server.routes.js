'use strict';
	var users = require('../../app/controllers/user.server.controller');
	var procs = require('../../app/controllers/procedimiento.server.min.js');
module.exports = function(app) {

	// procs Routes
	app.route('/procs')
		.get(procs.list)
		.post(procs.create);

	app.route('/procs/:procsId')
		.get(procs.read)
		.put(procs.update)
		.delete(procs.delete);

	app.route('/procs/getList')
	   .post(procs.getList);
// Finish by binding the Pai middleware
     app.param('procsId', procs.procsByID);
};