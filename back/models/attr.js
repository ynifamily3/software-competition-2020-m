const mongoose = require('mongoose');
const {Schema} = mongoose;

const AttrSchema = new Schema({
	prefix:{
		type:String,
		default:""
	},
	content:{
		type:String,
		default:""
	},
	postfix:{
		type:String,
		default:""
	},
	parentId:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'Info'
	}
});

module.exports = mongoose.model('Attr',AttrSchema,'Attr');
