const Item = require('../../models/Item')




exports.show = function(req, res) {

	Item.find({user: req.user.id}, function( err, items) {
		if (err) {
			res.send(err)
		}

		// find cover photo, if not use 1st
		coverImg = ""
        foundCover = false;
		

		for (let i = 0; i < items.length; i++) {
			items[i].images.forEach((img) => {
				if (items[i].images.isCover == true) {
					foundCover = true;
					items[i].coverImg = items[i].images.data
				}
			})
			if (foundCover == false) {
				items[i].coverImg = items[i].images[0].data
			}
		}

		res.render('myshop', {
			title: 'Shoppes',
			user: req.user,
			items: items
		});
	})
	
};