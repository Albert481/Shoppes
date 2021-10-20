const User = require('../../models/User')

exports.showProfile = function(req, res) {
    res.render('profile', {
        title: "Profile Settings",
        user: req.user
    })
};

exports.updateProfile = function(req, res) {


    console.log('reqbody contents: ' + JSON.stringify(req.body))
    
    var updatedUserData = {
        updatedAt: Date.now(),
        fname: req.body.fname,
        lname: req.body.lname,
        bio: req.body.bio
    }

    User.update(updatedUserData, {where: {id: req.user.id}}).then((updated)=>{
        res.render('profile', {
            title: "Profile Settings",
            user: req.user
        })
    })
};