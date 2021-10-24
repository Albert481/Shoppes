var express = require('express');
var router = express.Router();
const upload = require("../../controllers/services/uploadProfileImages");
var profileController = require('../../controllers/account/profile');
var accountController = require('../../controllers/account/settings');


router.get('/', accountController.show)

router.get('/profile', profileController.showProfile)
router.post('/profile', upload.single('profileimage'), profileController.updateProfile)

router.get('/settings', accountController.showSettings)
router.post('/settings', accountController.updateSettings)




module.exports = router;