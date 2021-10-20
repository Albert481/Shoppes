exports.show = function(req, res) {
	// Render home screen
	res.render('account', {
		title: 'Manage Account Settings',
		user: req.user
	});
};

exports.showSettings = function(req, res) {
	// Render home screen
	res.render('account', {
		title: 'Manage Account Settings',
		user: req.user
	});
};
