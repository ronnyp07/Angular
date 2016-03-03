'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
    autoIncrement.initialize(mongoose);

/**
 * Sector Schema
 */
 
var ResultSchema = new Schema({
	rSereal: {
		type: String,
		required: 'Nombre de reporte requerido',
		trim: true,
		index: {unique: true}
	},
    tipomuestra: {
    	type: String,
		trim: true
    },
    tipomuestraDesc: {
    	type: String,
		trim: true
    },
    reportStatus: {
    	type: String,
		trim: true
    },   
    total: {
		type: Number,
		trim: true
	},
	noAutho: {
		type: String,
		trim: true
	},
	costo: {
		type: Number,
		trim: true
	},
	pago: {
		type: Number,
		trim: true
	},
	debe: {
		type: Number,
		trim: true
	},
	status: {
		type: String,
		trim: true
	},
	resultado: {},
	seguroDesc: {
		type: String,
		trim: true
	},
	is_active: {type: Boolean, default: true},

    tecnica: {
        type: String,
		trim: true
    },
    nota: {
        type: String,
		trim: true
    },
    diagnostico: {
    	type: String,
		trim: true
    },
	created: {
		type: Date,
		default: Date.now
	},
	updateDate: {
	    type: Date
	},
	clinica: {
		type:Schema.ObjectId,
		ref: 'Clientes'
	},
	seguroId: {
		type:Schema.ObjectId,
		ref: 'locations'
	},
	doctor: {
		type:Schema.ObjectId,
		ref: 'Doctors'
	},
	patientReport:{
		type: Schema.ObjectId,
		ref: 'Patients'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	updatedUser: {
	    type: Schema.ObjectId,
		ref: 'User'
	},
	procs: {
        type: Schema.ObjectId,
		ref: 'Procs'
	},
	orders: {
		type: Schema.ObjectId,
		ref: 'orders'
	}
});


ResultSchema.plugin(autoIncrement.plugin, {
    model: 'Result',
    field: 'ResultId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Result', ResultSchema);