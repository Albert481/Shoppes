const Item = require('../../models/Item')




exports.show = function(req, res) {

	Item.find({user: req.user.id}, function( err, items) {
		if (err) {
			res.send(err)
		}
		res.render('myshop', {
			title: 'Shoppes',
			user: req.user,
			items: items
		});
	})
	
};