exports.show = function(req, res) {
	// Render home screen
	res.render('category', {
		title: 'Category',
		user: req.user
	});
};