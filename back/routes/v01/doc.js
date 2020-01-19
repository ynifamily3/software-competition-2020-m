const router = require('express').Router();
const docManager = require('./docManager')

router.get('/getInfosList',(req,res,next)=>{

	return res.json({state:'Boolean',msg:'string',names:['String'],ids:['MongoDBId']});
});

router.post('/createInfo',(req,res,next)=>{

	
	//if(!req.body.parentId)
	//	return docManager.makeInfo(res,req.body.name,null)
	//else
		return docManager.makeInfo(res,req.body.name,req.body.parentId);

	//return res.json({
	//    state : "Boolean",
	//    msg   : "String",
	//    id    : "MongoDBId"
	//	});
});

router.post('/createAttr',(req,res,next)=>{
	return docManager.makeAttr(res,req.body.prefix,req.body.content,req.body.postfix,req.body.parentId);
})

router.post('/modifyInfo',(req,res,next)=>{
	//	console.log(`name ${req.body.name}`);
	//console.log(`id ${req.body.parentId}`);
	//
	return docManage.modifyInfo(res,req.body.name,req.body.id);

	//	return res.json({
	//		state:"Boolean",
	//	msg:"String"
	//	})
});

router.delete('/deleteInfo',(req,res,next)=>{
	
	return res.json({
		state:"Boolean",
		msg:"String"
	})
});

module.exports = router
