'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/user.server.controller');
	var doctors = require('../../app/controllers/doctor.server.controller.js');

	// doctors Routes
	app.route('/api/doctors')
		.get(doctors.list)
		.post(doctors.create);

	app.route('/api/doctors/:doctorId')
		.get(doctors.read)
		.put(doctors.update)
		.delete(doctors.delete);

	app.route('/doctor/getList')
	   .post(doctors.getList);

	 app.route('/doctor/filter')
	   .post(doctors.getfilterDoctor);
	// Finish by binding the Pai middleware
	app.param('doctorId', doctors.DoctorByID);
};