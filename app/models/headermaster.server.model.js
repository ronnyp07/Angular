'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), 
    autoIncrement = require('mongoose-auto-increment'),
	Schema = mongoose.Schema;

    autoIncrement.initialize(mongoose);
/**
 * Headermaster Schema
 */
var HeadermasterSchema = new Schema({
	 code : {type: String, trim: true},
	 value: { type: String, trim: true},
	 remark: { type: String, trim: true},
	 description: {type: String, trim: true},
	 maintainParent: { type: Schema.ObjectId, ref: 'Maintain'},
	 location: { type: Schema.ObjectId, ref: 'locations'},
	 createDate: { type: Date, default: Date.now },
	 createUser: { type: Schema.ObjectId, ref: 'User' },
     updateUser:{ type: Schema.ObjectId, ref: 'User'},
     updateDate:{ type: Date, default: Date.now}
});

HeadermasterSchema.plugin(autoIncrement.plugin, {
    model: 'HeaderMaster',
    field: 'headermasterId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Headermaster', HeadermasterSchema);
