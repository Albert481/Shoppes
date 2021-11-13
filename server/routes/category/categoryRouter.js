var express = require('express');
var router = express.Router();
var categoryController = require('../../controllers/category/catController');

router.get('/:catName', categoryController.showCatItems)

router.get('/:catName/:subCatName', categoryController.showSubCatItems)


module.exports = router;