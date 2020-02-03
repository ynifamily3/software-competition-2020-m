const router = require('express').Router();

const v01=require('./v01');

//var whitelist = [
//'http://127.0.0.1',
//'http://127.0.0.1:3000',
//'https://127.0.0.1',
//'https://127.0.0.1:3000',
//'http://localhost',
//'http://localhost:3000',
//'https://localhost',
//'https://localhost:3000'
//]

router.all('/*',(req,res,next)=>{
	var origin = req.headers.origin;
	//if(whitelist.indexOf(req.headers.origin)>-1)
	//{
		//whitelist set
	//}
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	next();
});

router.use('/v01',v01);

//export default router;
module.exports = router;
