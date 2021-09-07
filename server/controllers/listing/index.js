exports.show = function(req, res) {
	// Render home screen
	res.render('index', {
		title: 'Shoppes',
		user: req.user
	});
};