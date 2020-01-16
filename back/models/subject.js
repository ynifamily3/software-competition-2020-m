const mongoose = require('mongoose');

const {Schema} = mongoose;

const SubjectSchema = new Schema({
	name:{
		type:String,
		default:"Subject"
	},
	attrs:[{type:mongoose.Schema.Types.ObjectId,ref:'Attr'}],
	childs:[{type:mongoose.Schema.Types.ObjectId,ref:'Info'}],
});

module.exports = mongoose.model('Subject',SubjectSchema,'Subject');
