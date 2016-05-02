'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Result = mongoose.model('Result'),
  deepPopulate = require('mongoose-deep-populate')(mongoose);
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
 * Create a Resultado
 */
exports.create = function(req, res) {
  var result = new Result(req.body);
  result.user = req.user;
  result.save(function(err) {
    if (err) {
      if(err.code === 11000){
              return res.status(401).send({
                message: 'Reporte ya existe'
          });
            }else {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
      }
    } else {
      res.jsonp(result);
    }
  });
};


/**
 * Get total of Results
 */
exports.getList = function(req, res) { 
   Result
    .find()
    .populate('clinica')
    .populate('doctor')
    .populate('patientReport')
    .sort({created: -1}).exec(function(err, result){
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(result);
    }
    });
};

/**
 * Get list pagination
 */
exports.listpage = function(req, res) { 
     var count = req.query.count || 25;
     var page = req.query.page || 1;
     var dates = JSON.parse(req.query.date);
     var search = JSON.parse(req.query.search);
     var endDate = new Date(dates.endDate);
     var endDateYear = endDate.getFullYear();
     var endDateMonth = endDate.getMonth();
     var endDateDay = endDate.getDate();
  
     var startDate = new Date(dates.startDate);
     var startDateYear = startDate.getFullYear();
     var startDateMonth = startDate.getMonth();
     var startDateDay = startDate.getDate();
     
     var sDateResult = startDateYear + '-' + ('0'+(startDateMonth + 1)).slice(-2) + '-' + ('0'+(startDateDay)).slice(-2);
     var eDateResult = endDateYear + '-' +  ('0'+(endDateMonth + 1)).slice(-2)+ '-' + ('0'+(endDateDay)).slice(-2);
     var pagination = {
      start : (page - 1) * count,
      count : count
     };

    // var sort ={
    //   sort: {
    //     tipomuestra: '1',
    //     ResultId: '-1'
    //   }
    //  };

    var contains = {};
    if(search.doctor && !search.paciente){
      contains = { tipomuestraDesc : search.sereal ? search.sereal : '',
                   seguroDesc: search.seguro ? search.seguro: '',
                   reportStatus: search.status,
                   doctor: mongoose.Types.ObjectId(search.doctor)};
    }else if(search.paciente && !search.doctor){
      contains = { tipomuestraDesc : search.sereal ? search.sereal : '',
                   seguroDesc: search.seguro ? search.seguro: '',
                   reportStatus: search.status ? search.status: null || '',
                   patientReport: mongoose.Types.ObjectId(search.paciente)};
    }else if(search.paciente && search.doctor){
      contains = { tipomuestraDesc : search.sereal ? search.sereal : '',
                   seguroDesc: search.seguro ? search.seguro: '',
                   reportStatus: search.status ? search.status: null || '',
                   doctor: mongoose.Types.ObjectId(search.doctor),
                   patientReport: mongoose.Types.ObjectId(search.paciente)};
    }else{
       contains =  { tipomuestraDesc : search.sereal ? search.sereal : '',
                     reportStatus: search.status ? search.status: null || '',
                     seguroDesc: search.seguro ? search.seguro: null || ''};
    }

    
    var filter = {
      filters: {
           mandatory :  contains
     }
   };
  
    Result
    .find({created: {'$gte':  sDateResult, '$lte': eDateResult}})
    .populate('orders')
    .populate('patientReport')
    .populate('patientReport.locations')
    .populate('doctor')
    .filter(filter)
    .sort({tipomuestra: 1, tipomuestraDesc: 1, rSereal:1})
    .page(pagination, function(err,tempate){
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
    Result.populate(tempate, {
      path: 'patientReport.locations',
      model: 'locations'
    },

    function(err, result) {
      if(err) return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
      res.jsonp(result); // This object should now be populated accordingly.
    });
      
    }
    });
};

exports.getResultbyOrder = function(req, res){
      var orderId = req.query.orderId;
       Result
       .find({orders: req.query.orderId}).exec(function(err, patient){
          if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(patient);
        }
      });
};

exports.getResultbyId = function(req, res){
      var resultId = req.body.resultId;
       
       Result
       .find({_id: resultId})
       .populate('user', 'displayName')
       .populate('orders')
       .populate('patientReport')
       .populate('seguroId')
       .populate('clinica')
       .populate('doctor')
       .exec(function(err, result){
          if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(result);
        }
      });
};

exports.getResultBy = function(req, res){
      var resultId = req.query;
      console.log(resultId);
  
       Result
       .find(resultId)
       .populate('user', 'displayName')
       .populate('orders')
       .populate('patientReport')
       .populate('seguroId')
       .populate('clinica')
       .populate('doctor')
       .exec(function(err, result){
          if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(result);
        }
      });
};

exports.getResultMaxByType = function(req, res){
      var resultId = req.body.resultType;
       Result
       .find({tipomuestra: resultId})
       .sort({ResultId: -1})
       .limit(1)
       .exec(function(err, result){
          if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(result);
        }
      });
};

/**
 * Show the current Resultado
 */
exports.read = function(req, res) {
  res.jsonp(req.result);
};


exports.resultByID = function(req, res, next, id) { 
  Result.findById(id).populate('user', 'displayName').populate('orders').exec(function(err, result) {
    if (err) return next(err);
    if (! result) return next(new Error('Failed to load procs ' + id));
    req.result = result ;
    //console.log(result);
    next();
  });
};

/**
 * Update a Resultado
 */
exports.update = function(req, res) {
  var result = req.result;
       result.resultado = req.body.resultado ?  req.body.resultado: result.resultado;
       result.diagnostico = req.body.diagnostico ? req.body.diagnostico : result.diagnostico;
       result.noAutho = req.body.noAutho ? req.body.noAutho : result.noAutho;
       result.updateDate = new Date();
       result.updatedUser = req.body.updatedUser ? req.body.updatedUser: result.updatedUser;
       result.reportStatus = req.body.reportStatus ? req.body.reportStatus : result.reportStatus;
       result.total = req.body.total ? req.body.total : result.total;
       result.nota =  req.body.nota ? req.body.nota : result.nota;
       result.tecnica = req.body.tecnica ? req.body.tecnica : result.tecnica;
       result.costo = req.body.costo ? req.body.costo : result.costo;
       result.pago = req.body.pago ? req.body.pago : result.pago;
       result.debe = req.body.debe;
       result.patientReport = req.body.patientReport ? req.body.patientReport : result.patientReport;
       result.seguroId = req.body.seguroId ? req.body.seguroId  : result.seguroId;
       result.doctor = req.body.doctor ? req.body.doctor : result.doctor;
       result.clinica  = req.body.clinica ? req.body.clinica : result.clinica;
       result.seguroDesc  = req.body.seguroDesc ? req.body.seguroDesc : result.seguroDesc;
       result.created = req.body.created ? req.body.created : result.created;
       result.createdDateDoctor = req.body.createdDateDoctor ? req.body.createdDateDoctor : result.createdDateDoctor;
  console.log(result);
  result.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(result);
    }
  });
};


 
