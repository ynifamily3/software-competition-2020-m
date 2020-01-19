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
						childs:[]
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

	Info.findOne({_id:id})
		.then((info)=>{

		})

}
