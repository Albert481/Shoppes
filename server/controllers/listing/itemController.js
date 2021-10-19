const upload = require("../services/uploadItemImages");
const arrayUpload = upload.array("images");

// import modules
var fs = require('fs');
var mime = require('mime');
var jimp = require('jimp')

const Item = require('../../models/Item')

exports.show = function(req, res) {
	// Render home screen
	res.render('sell', {
		title: "Sell",
		user: req.user
	});
};

exports.showItem = function(req, res) {
    var ObjectId = require('mongodb').ObjectId; 
    var id = req.params.itemId;       
    var o_id = new ObjectId(id);
    Item.findOne({_id: o_id}, function( err, item) {
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
    })
    
}

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

exports.editItem = function(req, res) {
    var ObjectId = require('mongodb').ObjectId; 
    var id = req.params.itemId;       
    var o_id = new ObjectId(id);

    var updatedItemData = {
        updatedAt: Date.now(),
        title: req.body.title,
        desc: req.body.desc,
        price: req.body.price,
        images: images
    }

    Item.updateOne(updatedItemData, {where: {_id: o_id}}).then((updated)=>{
        res.render('edititem', {
            title: "Edit Listing",
            user: req.user,
            item: item
        })
    })
    
}

// create listing
exports.addItem = async (req,res,next) => {

    console.log("req.files " + JSON.stringify(req.files))
    console.log("req.body " + JSON.stringify(req.body))

    var populatedFields = req.body

    let fileArray = req.files["images"];
    const images = [];

    for (let i = 0; i < fileArray.length; i++) {

        var imageData = {
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
        

                return res.redirect('/')
                // return res.render('error', {
                //     message: err.message,
                //     error: {},
                //     title: 'Error uploading image'
                // })
            }
        }

    })

            // return res.redirect('/')
            // if (!req.files['images'])
            //     return next();
            // req.files['images'].forEach((items)=> {
            //     console.log('IMAGE LOGS HERE')
            //     console.log(items)
            //     var src,dest,targetPath,targetName,tempPath = items.path;
            //     var type = mime.getType(items.mimetype);
            //     var extension = items.path.split(/[. ]+/).pop();
            //     if (IMAGE_TYPES.indexOf(type) == -1){
            //         return res.status(415).send('Only jpeg, jpg and png are allowed.')
            //     }

            //     targetPath = './public/uploads/images/'+req.user.userId+'/items/'+req.res.locals.newItemId+'/' + items['originalname'];
            //     src = fs.createReadStream(tempPath);
            //     dest = fs.createWriteStream(targetPath);
            //     console.log('BEFORE PIPING')
            //     src.pipe(dest)
            //     src.on('error',(err)=>{
            //         return res.render('error', {
            //             message: err.message,
            //             error: {},
            //             title: 'Error uploading image'
            //         });
            //     });
            //     src.on('end', ()=>{
            //         var imageData = {
            //             imgItemName: items['originalname'],
            //             itemId: req.res.locals.newItemId,
            //             imgItemCover: false
            //         }
            //         console.log('BEFORE CREATING IMAGE')

            //         // resize image
            //         jimp.read(targetPath).then((img)=>{
            //             img.resize(400,jimp.AUTO)
            //             img.write(targetPath)
            //             console.log('resized image')
            //         }).catch((err)=>{
            //             return res.render('error', {
            //                 message: err.message,
            //                 error: {},
            //                 title: 'Error uploading image'
            //             });
            //         })
            //         console.log(items)
            //         console.log('ITEM CREATED')
            //         fs.unlink(tempPath, (err)=>{
            //             if (err)
            //                 console.log(err)
            //         })
            //     })
            // })
            // return next();

}

exports.hasAuthorization = (req,res,next)=>{
    // if (!req.isAuthenticated()){
    //     return res.redirect('/login')
    // }
    // // if user account is not activated
    // if (!req.user.active){
    //     req.flash('loginMessage',"You are not allowed to view this page.")
    //     return res.redirect('/')
    // }
    next();
}