var express = require('express');
var multer = require('multer');
var upload = multer({dest: './public/uploads/dest'});
var router = express.Router();
var itemController = require('../../controllers/listing/itemController');
var imgController = require('../../controllers/listing/imgController');

router.get('/sell', itemController.hasAuthorization,(req,res)=>{
  res.render('sell',{
  title: "Sell",
  user: req.user
  })
})
router.post('/sell', itemController.hasAuthorization, itemController.addItem)

module.exports = router;