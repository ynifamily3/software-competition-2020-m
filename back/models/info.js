const mongoose = require('mongoose');

const {Schema}=mongoose;

const InfoSchema = new Schema({
	name:{
		type:String,
		default:""
	},
	attrs:[{type:mongoose.Schema.Types.ObjectId,ref:'Attr'}],
	childs:[{type:mongoose.Schema.Types.ObjectId,ref:'Info'}],
	parentId:{type:mongoose.Schema.Types.ObjectId,ref:'Info'}
});

module.exports = mongoose.model('Info',InfoSchema,'Info');
