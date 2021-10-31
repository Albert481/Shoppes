var express = require('express');
const upload = require("../../controllers/services/uploadItemImages");
var router = express.Router();
var itemController = require('../../controllers/listing/itemController');

router.get('/sell', itemController.hasAuthorization,(req,res)=>{
  res.render('sell',{
  title: "Sell",
  user: req.user
  })
})
router.post('/sell', itemController.hasAuthorization, upload.fields([{name:'images',maxCount:4}]), itemController.addItem)

router.get('/:itemId', itemController.showItem)

router.get('/edit/:itemId', itemController.hasAuthorization, itemController.editItemPage)
router.post('/edit/:itemId', itemController.hasAuthorization, upload.fields([{name:'images',maxCount:4}]), itemController.editItem)




module.exports = router;