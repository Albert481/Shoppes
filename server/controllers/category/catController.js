categoryArr = []
subCatArr = []

exports.showCatItems = function(req, res) {

	categoryArr.includes(req.params["catName"])

	res.render('category', {
		title: 'Category',
		user: req.user
	});
};

exports.showSubCatItems = function(req, res) {


	subCatArr.includes(req.params["subCatName"])
	categoryArr.includes(req.params["catName"])

	res.render('category', {
		title: 'Category',
		user: req.user
	});
};