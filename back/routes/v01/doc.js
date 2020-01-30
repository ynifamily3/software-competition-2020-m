const router = require('express').Router();
const docManager = require('./docManager')

router.get('/getInfosList',(req,res,next)=>{

	return docManager.getInfosList(res);

	//return res.json({state:'Boolean',msg:'string',names:['String'],ids:['MongoDBId']});
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

router.post('/readInfo',(req,res,next)=>{

	docManager.readInfo(res,req.body.id,true)

	console.log("test");

	return res.json({test:"test"})
})

router.post('/modifyInfo',(req,res,next)=>{
	//	console.log(`name ${req.body.name}`);
	//console.log(`id ${req.body.parentId}`);
	//
	console.log("dfdfdfcvcvcxnjkfas;klrtel;r")
	return docManager.modifyInfo(res,req.body.name,req.body.id);

	//	return res.json({
	//		state:"Boolean",
	//	msg:"String"
	//	})
});

router.post('/modifyAttr',(req,res,next)=>{
	return docManager.modifyAttr(res,req.body.prefix,req.body.content,req.body.postfix,req.body.aid);
})

router.post('/deleteInfo',(req,res,next)=>{
	return docManager.deleteInfo(res,req.body.id,true)
	/*
	return res.json({
		state:"Boolean",
		msg:"String"
	})
	*/
});

router.post('/deleteAttr',(req,res,next)=>{

	return docManager.deleteAttr(res,req.body.aid);
})

module.exports = router