'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Locations = mongoose.model('locations');



// Crear un nuevo método controller manejador de errores
var getErrorMessage = function(err) {
  // Definir la variable de error message
  var message = '';

  // Si un error interno de MongoDB ocurre obtener el mensaje de error
  if (err.code) {
    switch (err.code) {
      // Si un eror de index único ocurre configurar el mensaje de error
      case 11000:
      case 11001:
        message = 'Este Pais ya existe';
        break;
      // Si un error general ocurre configurar el mensaje de error
      default:
        message = 'Se ha producido un error';
    }
  } else {
    // Grabar el primer mensaje de error de una lista de posibles errores
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
  // Devolver el mensaje de error
  return message;
};

/**
 * Create a Pai
 */
exports.create = function(req, res) {
	var locations = new Locations(req.body);
	locations.user = req.user;

	locations.save(function(err) {
		if (err) {
			if(err.code === 11000){
              return res.status(401).send({
					      message: 'Centro ya existe'
			    });
            }else {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		  }
		} else {
			res.jsonp(locations);
		}
	});
};

/**
 * Show the current Pai
 */
exports.read = function(req, res) {
	res.jsonp(req.location);
};

/**
 * Update a Pai
 */
exports.update = function(req, res) {
	var location = req.location; 
    location.name = req.body.name;
    location.tipo = req.body.tipo;
    location.locationRNC = req.body.locationRNC;
    location.locationTelefono = req.body.locationTelefono;
    location.pais = req.body.pais;
	location.ciudad = req.body.ciudad;
	location.sector = req.body.sector;
	location.locationDireccion = req.body.locationDireccion;
	location.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(location);
		}
	});
};

/**
 * Delete an Pai
 */
exports.delete = function(req, res) {
  var location = req.location ;
	location.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(location);
		}
	});
};

/**
 * List of Pais
 */
exports.list = function(req, res) { 
     
     var count = req.query.count || 5;
     var page = req.query.page || 1;

     var filter = {
     	filters: {
     		field: ['name', 'locationRNC', 'locationTelefono'],
     		mandatory: {
     			contains: req.query.filter
     		}
     	}
     };

     var pagination = {
     	start : (page - 1) * count,
     	count : count
     };

     var sort ={
     	sort: {
     		desc: '_id'
     	}
     };
    
    Locations
    .find()
    .filter(filter)
    .order(sort)
    .page(pagination, function(err, location){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(location);
		}
    });
};

exports.getList = function(req, res) { 
   Locations
    .find().exec(function(err, patient){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
    });
};

/**
 * Pai middleware
 */
exports.locationsByID = function(req, res, next, id) { 
	Locations.findById(id).populate('user', 'displayName').exec(function(err, location) {
		if (err) return next(err);
		if (! location) return next(new Error('Failed to load location ' + id));
		req.location = location ;
		next();
	});
};

/**
 * Pai authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.location.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
