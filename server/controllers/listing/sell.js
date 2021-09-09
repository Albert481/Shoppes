exports.show = function(req, res) {
	// Render home screen
	res.render('sell', {
		title: "Sell",
		user: req.user
	});
};


exports.submit = function(req, res) {
	var userId = newUser.userId
	var imgProfileName = 'defaultProfilePicture.png'
	var targetPath = './public/uploads/images/'+userId+'/profile/'+imgProfileName;
}