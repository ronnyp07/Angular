// Invocar modo JavaScript 'strict'
'use strict';

	var users = require('../../app/controllers/user.server.controller');
	var template = require('../../app/controllers/tempresult.server.controller');

module.exports = function(app) {

   app.route('/tempresult')
		.post(template.create);
   
   app.route('/api/template')
		.get(template.listpage)

   app.route('/tempresult/:tempresultId')
		.get(template.read)
		.put(template.update)
	// 	.delete(users.requiresLogin,  order.delete);

   // Finish by binding the Pai middleware
   app.param('tempresultId', template.TemplateByID);
};