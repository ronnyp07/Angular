'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.min.js');
	app.route('/').get(core.index);
};