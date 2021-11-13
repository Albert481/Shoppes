const Item = require('../../models/Item')

// GET: index / home page
exports.show = function(req, res) {

	// Discover listing
	var discoverListing = Item.aggregate([{ $sample: {size: 10}}], function( err, discoveritems) {
		// find cover photo, if not use 1st
		// coverImg = ""
		// foundCover = false;

		// for (let i = 0; i < discoveritems.length; i++) {
		// 	discoveritems[i].images.forEach((img) => {
		// 		if (discoveritems[i].images.isCover == true) {
		// 			foundCover = true;
		// 			discoveritems[i].coverImg = discoveritems[i].images.data
		// 		}
		// 	})
		// 	if (foundCover == false) {
		// 		discoveritems[i].coverImg = discoveritems[i].images[0].data
		// 	}
		// }
	})

	// Recommended for you
	var recommendedListing = Item.aggregate([{ $sample: {size: 10}}], async function( err, recommendeditems) {
		if (err) {
			res.send(err)
		}

		// find cover photo, if not use 1st
		// coverImg = ""
		// foundCover = false;
		

		// for (let i = 0; i < recommendeditems.length; i++) {
		// 	recommendeditems[i].images.forEach((img) => {
		// 		if (recommendeditems[i].images.isCover == true) {
		// 			foundCover = true;
		// 			recommendeditems[i].coverImg = recommendeditems[i].images.data
		// 		}
		// 	})
		// 	if (foundCover == false) {
		// 		recommendeditems[i].coverImg = recommendeditems[i].images[0].data
		// 	}
		// }


	})

	Promise.all([discoverListing, recommendedListing]).then(data => {
		const [discoverListing, recommendedListing] = data
		console.log("DISCOVER: " + JSON.stringify(discoverListing))
		console.log("RECOMMENDED: " + JSON.stringify(recommendedListing))
		res.render('index', {
			title: 'Shoppes',
			user: req.user,
			discoveritems: discoverListing,
			recommendeditems: recommendedListing
		});
	})
	

};