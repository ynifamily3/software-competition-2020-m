const router = require('express').Router();
const docManager = require('./docManager')

router.post('/createSubject',(req,res,next)=>{

	console.log("post")

	console.log(`name ${req.body.name}`);
	console.log(`id ${req.body.parentId}`);

	docManager.makeSubject(res,req.body.name);

	/*
	return res.json({
    state : "Boolean",
    msg   : "String",
    id    : "MongoDBId"
	});
	*/

});

router.get('/getInfosList',(req,res,next)=>{

	return res.json({state:'Boolean',msg:'string',names:['String'],ids:['MongoDBId']});
});

router.post('/createInfo',(req,res,next)=>{

	console.log(`name ${req.body.name}`);
	console.log(`id ${req.body.parentId}`);

	return res.json({
    state : "Boolean",
    msg   : "String",
    id    : "MongoDBId"
	});
});

router.post('/modifyInfo',(req,res,next)=>{
	console.log(`name ${req.body.name}`);
	console.log(`id ${req.body.parentId}`);

	return res.json({
		state:"Boolean",
		msg:"String"
	})
});

router.delete('/deleteInfo',(req,res,next)=>{
	
	return res.json({
		state:"Boolean",
		msg:"String"
	})
});

module.exports = router
