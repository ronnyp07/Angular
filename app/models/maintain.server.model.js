'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
	Schema = mongoose.Schema;

    autoIncrement.initialize(mongoose);

/**
 * Maintain Schema
 */
var MaintainSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Maintain name',
		trim: true
	},
	parameters: [{
	    code : {type: String, trim: true},
	    value: { type: String, trim: true},
	    remark: { type: String, trim: true},
	    description: {type: String, trim: true},
	    location: {
	    type: Schema.ObjectId,
		ref: 'locations'},
	    created: {type: Date, default: Date.now}
	}],
	code: {
        type: String,
		default: '',
		trim: true
	},
	parents: {
		type: Schema.ObjectId,
		ref: 'Maintain'
	},
	desc: {
		type: String,
		default: '',
		trim: true
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
		type: Date
	}


});

MaintainSchema.plugin(autoIncrement.plugin, {
    model: 'Maintain',
    field: 'maintainId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Maintain', MaintainSchema);