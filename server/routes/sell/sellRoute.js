var express = require('express');
var multer = require('multer');
var upload = multer({dest: './public/uploads/dest'});
var router = express.Router();
var itemController = require('../controllers/itemController');
var imgController = require('../controllers/imgController');

router.get('/sell', itemController.hasAuthorization,(req,res)=>{
    res.render('sellItem',{
		title: "Sell",
		user: req.user
    })
})
router.post('/sell', itemController.hasAuthorization, upload.fields([{name:'imageCover',maxCount:1},{name:'images',maxCount:3}]), itemController.addItem, imgController.uploadItemImg)

module.exports = router;