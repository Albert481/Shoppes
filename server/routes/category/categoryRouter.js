var express = require('express');
var router = express.Router();
var categoryController = require('../../controllers/category/catController');

router.get('/', categoryController.show)


module.exports = router;