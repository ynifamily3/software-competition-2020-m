const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");


const api=require('./routes');
const dbConnect = require('./models');

const PORT = process.env.PORT||3000;

const app = express();

dbConnect();

//router
//app.use(app.Router);
//api.initialize(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//app.use(router);

app.use('/',api);

app.listen(PORT,err=>{
	if(err) throw err;
	console.log(`Listening on ::${PORT}`);
});
