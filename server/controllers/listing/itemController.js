const S3upload = require("../services/uploadItemImages");
const S3delete = require("../services/deleteItemImages");
const arrayUpload = S3upload.array("images");

// import modules
var fs = require('fs');
var mime = require('mime');
var jimp = require('jimp')

const Item = require('../../models/Item')

// GET: sell listing page
exports.show = function(req, res) {
	res.render('sell', {
		title: "Sell",
		user: req.user
	});
};

// GET: individual item
exports.showItem = function(req, res) {
    var ObjectId = require('mongodb').ObjectId; 
    var id = req.params.itemId;       
    var o_id = new ObjectId(id);
    Item.findOne({_id: o_id}, function( err, item) {
        if (err || item === null) {
            console.log('Item not found')
            res.render('error', {
                title: "Error",
                error: "Item not found",
                user: null
            })
        } else {
            console.log(item)

            // find cover photo, if not use 1st
            coverImg = ""
            foundCover = false;
            item.images.forEach((img) => {
                if (img.isCover == true) {
                    foundCover = true;
                    coverImg = img.data
                }
            })
            if (foundCover == false) {
                coverImg = item.images[0].data
            }
    
    
            res.render('item', {
                title: "Listing",
                user: req.user,
                item: item,
                coverImg: coverImg
            })
        }
        
    })
    
}

// GET: edit item page
exports.editItemPage = function(req, res) {
    var ObjectId = require('mongodb').ObjectId; 
    var id = req.params.itemId;       
    var o_id = new ObjectId(id);

    Item.findOne({_id: o_id}, function( err, item) {
        console.log(item)

        res.render('edititem', {
            title: "Edit Listing",
            user: req.user,
            item: item
        })
    })
    
}

// POST: edit listing
exports.editItem = function(req, res) {
    var ObjectId = require('mongodb').ObjectId; 
    var id = req.params.itemId;       
    var o_id = new ObjectId(id);

    // if images are edited/ user uploaded new images
    if (req.files["images"]){
        let fileArray = req.files["images"];
        const images = [];
    
        for (let i = 0; i < fileArray.length; i++) {
    
            var imageData = {
                data: fileArray[i].location,
                isCover: false
            }
    
            images.push(imageData)
        }

        var updatedItemData = {
            updatedAt: Date.now(),
            title: req.body.title,
            desc: req.body.desc,
            price: req.body.price,
            images: images
        }
    } else {
        var updatedItemData = {
            updatedAt: Date.now(),
            title: req.body.title,
            desc: req.body.desc,
            price: req.body.price
        }
    }


    Item.updateOne({_id: o_id}, updatedItemData).then((updated)=>{
        console.log('UPDATED ITEM: ' + JSON.stringify(updated))
        res.redirect('/myshop');
    })
    
}

// POST: create listing
exports.addItem = async (req,res,next) => {

    console.log("req.files " + JSON.stringify(req.files))
    console.log("req.body " + JSON.stringify(req.body))

    var populatedFields = req.body

    // TODO: Validation for images REQUIRED

    let fileArray = req.files["images"];
    const images = [];

    for (let i = 0; i < fileArray.length; i++) {

        var imageData = {
            key: fileArray[i].key,
            data: fileArray[i].location,
            isCover: false
        }

        images.push(imageData)
    }

    arrayUpload(req, res, (error) => {
        if (error) {
            console.log('errors', error);
            res.status(500).json({
                status: 'fail',
                error: error
            });
        } else {
            // If file not found
            if (req.files === undefined) {
                console.log("uploadItemImages Error: No File Selected");
                res.status(500).json({
                    status: 'fail',
                    message: 'Error: No File Selected'
                });
            } else {
                // If Success
                var itemData = {
                    user: req.user.id,
                    createdAt: Date.now(),
                    title: populatedFields.title,
                    desc: populatedFields.desc,
                    price: populatedFields.price,
                    images: images
                }

                // create item
                try {
                    Item.create(itemData)
                } catch (err) {
                    console.error(err)
                }
        

                return res.redirect('/myshop')
                // return res.render('error', {
                //     message: err.message,
                //     error: {},
                //     title: 'Error uploading image'
                // })
            }
        }

    })
}

// POST: delete listing
exports.deleteItem = function(req, res) {
    var ObjectId = require('mongodb').ObjectId; 
    var id = req.params.itemId;       
    var o_id = new ObjectId(id);
    var userId = req.user.userId
    var adminCheck = req.user.status

    // Find if item exist
    Item.findOne({_id: o_id}).then(function(item) {
        if ((!item) || !(item.userId==userId||adminCheck=='admin')){
            return res.render('error', {
                message: 'Error deleting item',
                error: {},
                title: 'Error deleting item'
            });
        }

        Item.findOneAndRemove({_id: o_id}, function(err, item) {
            if (!err && item) {
                console.log(item);
                console.log("item successfully deleted")
            }
            else {
                console.log("error")
            }
        })

        item.images.forEach((i) => {
            S3delete.deleteItemImageByKey(i.key)
        })
        res.json({status: "Success", redirect: '/myshop'});
        
    })
    

    
}

exports.hasAuthorization = (req,res,next)=>{
    if (!req.isAuthenticated()){
        return res.redirect('/')
    }
    next();
}