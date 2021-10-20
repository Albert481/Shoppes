var express = require('express');
var router = express.Router();
const upload = require("../../controllers/services/uploadProfileImages");
var profileController = require('../../controllers/account/profile');
var accountController = require('../../controllers/account/settings');

// router.get('/sell', itemController.hasAuthorization,(req,res)=>{
//   res.render('sell',{
//   title: "Sell",
//   user: req.user
//   })
// })
// router.post('/sell', itemController.hasAuthorization, upload.fields([{name:'images',maxCount:4}]), itemController.addItem)

router.get('/', accountController.show)

router.get('/profile', profileController.showProfile)
router.post('/profile', upload.single('profileimage'), profileController.updateProfile)
router.get('/settings', accountController.showSettings)

// router.get('/edit/:itemId', itemController.hasAuthorization, itemController.editItemPage)
// router.post('/edit/:itemId', itemController.hasAuthorization, itemController.editItem)



module.exports = router;