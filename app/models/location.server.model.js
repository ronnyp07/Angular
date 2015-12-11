'use strict';

var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
	Schema = mongoose.Schema;


    autoIncrement.initialize(mongoose);
/**
 * Pai Schema
 */
var locationSchema = new Schema({
	name: {
		type: String,
		default: '',
		unique: true,
		required: 'Nombre de location es requerido',
		trim: true
	},

    locationRNC: {
    	type: String,
		trim: true
    },

    locationTelefono: {
    	type: String,
		trim: true	
    },

    locationDireccion: {
    	type: String,
		trim: true	
    },

    pais: {
		type: Schema.ObjectId,
		ref: 'Pais'
	},
	ciudad: {
		type: Schema.ObjectId,
		ref: 'Ciudad'
	},
	sector: {
		type: Schema.ObjectId,
		ref: 'Sector'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    updateUser:{
		type: Schema.ObjectId,
		ref: 'User'
	},
     updateDate:{
		type: Date,
		default: Date.now
	}
});

locationSchema.plugin(autoIncrement.plugin, {
    model: 'locations',
    field: 'locationId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('locations', locationSchema);