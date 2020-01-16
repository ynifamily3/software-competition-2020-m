const Attr = require('../../models/attr');
const Info = require('../../models/info');
const Subject = require('../../models/subject');

exports.makeSubject = (res,subjectName) => {
	Subject.findOne({name:subjectName})
		.then((sub)=>{
			if(!sub){
				console.log('make subject');
				let newSubject = new Subject({
					name:subjectName,
					attrs:[],
					childe:[]
				})
				newSubject.save()
					.then((subject)=>{
						return res.json({
							state:true,
							msg:'Success',
							id:subject._id
						})
					})
			}
			else {
				console.log('makeSubject failed')
				return res.json({
					state:false,
					msg:'Same SubjectName',
					id:null
				})
			}
		})
		.catch((err)=>{
			console.log('makeSubject failed d error')
				return res.json({
					state:false,
					msg:'Same SubjectName',
					id:null
				})
		})
};
