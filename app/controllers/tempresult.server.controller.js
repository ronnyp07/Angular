'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Template = mongoose.model('Tempresult')

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
  var template = new Template(req.body);
  template.user = req.user;
  template.save(function(err) {
    if (err) {
      if(err.code === 11000){
              return res.status(401).send({
                message: 'Pais ya existe'
          });
            }else {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
      }
    } else {
      res.jsonp(template);
    }
  });
};


exports.listpage = function(req, res) { 
     var count = req.query.count || 5;
     var page = req.query.page || 1;
    
     var pagination = {
      start : (page - 1) * count,
      count : count
     }

    var filter = {
      filters: {
       // field: ['reportname'],
           mandatory : {
            contains : {
                reportname : req.query.filter
            }
      }
     }
   }

    console.log(pagination);
    Template
    .find()
    .filter(filter)
    .page(pagination, function(err,tempate){
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tempate);
    }
    });
};

/**
 * Show the current Pai
 */
exports.read = function(req, res) {
  console.log('the request read');
  res.jsonp(req.template);
};

/**
 * Update a Pai
 */
exports.update = function(req, res) {
  var template = req.template ; 
      template.reportname = req.body.reportname;
      template.tipomuestra = req.body.tipomuestra;
      template.resultado = req.body.resultado;
      template.tecnica = req.body.tecnica;
      template.TemplateTelefono = req.body.TemplateTelefono;
      template.nota = req.body.nota;
      template.diagnostico = req.body.diagnostico;
    // Template.ciudad = req.body.ciudad;
    // Template.sector = req.body.sector

   template.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(template);
    }
  });
};

/**
 * Delete an Pai
 */
exports.delete = function(req, res) {
  var Template = req.Template ;
  Template.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Template);
    }
  });
};


/**
 * Pai middleware
 */
exports.TemplateByID = function(req, res, next, id) { 
  Template.findById(id).populate('user', 'displayName').exec(function(err, template) {
    if (err){  
      console.log('passbyhere');
      return next(err);
     } 
    if (! template) return next(new Error('Failed to load Template ' + id));
    req.template = template ;
    console.log('passbyhere');
    next();
  });
};

/**
 * Pai authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.Template.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};


exports.lastTemplate = function(req, res, next){
    Template.nextCount(function(err, count) {
    
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(count);
    }

   });
};