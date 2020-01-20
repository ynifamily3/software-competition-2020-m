const Attr = require('../../models/attr');
const Info = require('../../models/info');

exports.makeInfo = (res,infoName,parent) => {

	if(parent==null||parent==undefined)
	{
		Info.findOne({name:infoName})
			.then((info)=>{
				if(!info){
					let newInfo=new Info({
						name:infoName,
						attrs:[],
						childs:[],
						parentId:null
					})
					newInfo.save()
						.then((info)=>{
							return res.json({
								state:true,
								msg:'Success',
								id:info._id
							})
						})
				}
				else{
					return res.json({
						state:false,
						msg:'Same InfoName',
						id:null
					})
				}
			})
			.catch((err)=>{
				return res.json({
					state:false,
					msg:'InfoName failed',
					id:null
				})
			})
	} else {
		Info.findOne({_id:parent}).populate('childs')
			.then(async (parent)=>{
				if(!parent){
					return res.json({
						state:false,
						msg:'Parent Not found',
						id:null
					})
				}
				else
				{
					for(child of parent.childs){
						if(child.name==infoName){
							return res.json({
								state:false,
								msg:'Same infoName',
								id:null
							})
						}
					}
					let newInfo= new Info({
						name:infoName,
						attrs:[],
						childs:[],
						parentId:parent._id
					})
					await newInfo.save()
						.then(async (info)=>{
							await Info.findOneAndUpdate({_id:parent._id},{$push:{childs:info}})

							return res.json({
								state:true,
								msg:'Success',
								id:newInfo._id
							})
						})
						.catch((err)=>{
							return res.json({
								state:false,
								msg:'Save DB error',
								id:null
							})
						})
				}
			})
			.catch((err)=>{
				return res.json({
					state:false,
					msg:'ParentId error',
					id:null
				})
			})
	}

}

exports.makeAttr = (res,prefix,content,postfix,parentId)=>{

	Info.findOne({_id:parentId})
		.then((info)=>{
			let newAttr = new Attr({
				prefix,
				content,
				postfix,
				parentId:info._id
			})
			newAttr.save()
				.then(async (attr)=>{
					await Info.findOneAndUpdate({_id:info._id},{$push:{attrs:attr}})

					return res.json({
						state:true,
						msg:'Success',
						aid:attr._id
					})
				})
		})
		.catch((err)=>{
			return res.json({
				state:false,
				msg:'Info Not Found',
				id:null
			})
		})
}

exports.modifyInfo = (res,name,id)=>{

	console.log("dfdfdfdfadfdas")
	Info.findOne({_id:id})//.populate('parentId')
		.then(async (info)=>{
			console.log(info)
			console.log('-------------------------------------------ccc-')

			if(info.parentId!=null){
				Info.findOne({_id:info.parentId}).populate('childs')
					.then(async(parent)=>{
						for(child of parent.childs){
							if(child.name==name){
								return res.json({
									state:false,
									msg:'Same InfoName'
								})
							}
						}

						await Info.findOneAndUpdate({_id:info._id},{'name':name})
							.then((info)=>{
								return res.json({
									state:true,
									msg:'Success'
								})
							})
							.catch((err)=>{
								return res.json({
									state:false,
									msg:'Info Not Found or Update error'
								})
							})
					})
					.catch((err)=>{
						return res.json({
							state:false,
							msg:'Parent Not Found'
						})
					})
			} else {
				Info.find({parentId:null})
					.then(async(subjects)=>{
						for(info of subjects){
							if(info.name==name){
								return res.json({
									state:false,
									msg:'Same InfoName'
								})
							}
						}

						await Info.findOneAndUpdate({_id:id},{'name':name})
							.then((info)=>{
								return res.json({
									state:true,
									msg:'Succes'
								})
							})
							.catch((err)=>{
								return res.json({
									state:false,
									msg:'Info Not Found or Update error'
								})
							})
					})
			}
		})
		.catch((err)=>{
			return res.json({
				state:false,
				msg:'Info Not Found'
			})
		})
}

exports.modifyAttr = (res,prefix,content,postfix,aid)=>{
	console.log('modi attr')
	Attr.findOneAndUpdate({_id:aid},{'prefix':prefix,'content':content,'postfix':postfix})
		.then((info)=>{
			console.log(info)
			return res.json({
				state:true,
				msg:'Success'
			})
		})
		.catch((err)=>{
			return res.json({
				state:false,
				msg:'Info Not Found or Update error'
			})
		})
}
