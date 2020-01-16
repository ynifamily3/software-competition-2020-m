const router = require('express').Router();

const testRouter = require('./test');

const docRouter = require('./doc');

router.use('/test',testRouter);

router.use('/doc',docRouter);



module.exports = router;
