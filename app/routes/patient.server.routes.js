'use strict';

// Cargar las dependencias del módulo
var users    = require('../../app/controllers/user.server.controller'), 
    patients = require('../../app/controllers/patient.server.controller');

// Definir el método routes de module
module.exports = function(app) {
	// Configurar la rutas base a 'articles'  
	app.route('/api/patients')
	   .get(patients.list)
	   .post(patients.create);
	
	// // Configurar las rutas 'articles' parametrizadas
		app.route('/api/patients/:patientId')
	   .get(patients.read)
	   .put(patients.update)
	   .delete(patients.delete);

	   	app.route('/patient/getList')
	   .post(patients.getList);
	// Configurar el parámetro middleware 'articleId'   
	  app.param('patientId', patients.patientByID);
};