const router =require('express').Router();

router.get('/',(req,res,next)=>{
	console.log('test info');

	return res.json({Test:true});
});

module.exports = router;
