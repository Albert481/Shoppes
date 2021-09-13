// import modules
var fs = require('fs');
var mime = require('mime');
var jimp = require('jimp')
// image file types
var IMAGE_TYPES = ['image/jpeg','image/jpg','image/png'];

const Item = require('../../models/Item')



exports.show = function(req, res) {
	// Render home screen
	res.render('sell', {
		title: "Sell",
		user: req.user
	});
};

// create listing
exports.addItem = async (req,res,next) => {
    var itemData = {
        user: req.user.id,
        title: req.body.title,
        desc: req.body.desc,
        price: req.body.price
    }
    // create item
    try {
        Item.create(itemData).then(data => {
            res.locals.newItemId = data['_id'];
        })  
    } catch (err) {
        console.error(err)
    }
}

// upload listing img
exports.uploadItemImg = (req,res,next) => {
    console.log("req.files[images]: " + req.files['images'])
    console.log("req.body " + req.body)
    var items = req.files['imageCover'][0]
    var src,dest,targetPath,targetName,tempPath = items.path;
    var type = mime.getType(items.mimetype);
    var extension = items.path.split(/[. ]+/).pop();
    var imagearray = [];


    if (IMAGE_TYPES.indexOf(type) == -1){
        return res.status(415).send('Only jpeg, jpg and png are allowed.')
    }

    targetPath = './public/uploads/images/'+req.user.userId+'/items/'+req.res.locals.newItemId+'/' + items['originalname'];
    fs.mkdir('./public/uploads/images/'+req.user.userId+'/items/'+req.res.locals.newItemId,function(err){
        if (err)
            console.log(err)
        src = fs.createReadStream(tempPath);
        dest = fs.createWriteStream(targetPath);
        console.log('BEFORE PIPING')
        src.pipe(dest)
        src.on('error',(err)=>{
            return res.render('error', {
                message: err.message,
                error: {},
                title: 'Error uploading image'
            });
        });
        src.on('end', ()=>{
            var imageData = {
                imgItemName: items['originalname'],
                itemId: req.res.locals.newItemId,
                imgItemCover: true
            }
            console.log('BEFORE CREATING IMAGE')
            imagearray.push(imageData)
            console.log('ITEM CREATED')
            // resize image
            jimp.read(targetPath).then((img)=>{
                img.resize(400,jimp.AUTO)
                img.write(targetPath)
                console.log('resized image')
            }).catch((err)=>{
                return res.render('error', {
                    message: err.message,
                    error: {},
                    title: 'Error uploading image'
                });
            })
            if (!req.files['images'])
                return next();
            req.files['images'].forEach((items)=> {
                console.log('IMAGE LOGS HERE')
                console.log(items)
                var src,dest,targetPath,targetName,tempPath = items.path;
                var type = mime.getType(items.mimetype);
                var extension = items.path.split(/[. ]+/).pop();
                if (IMAGE_TYPES.indexOf(type) == -1){
                    return res.status(415).send('Only jpeg, jpg and png are allowed.')
                }

                targetPath = './public/uploads/images/'+req.user.userId+'/items/'+req.res.locals.newItemId+'/' + items['originalname'];
                src = fs.createReadStream(tempPath);
                dest = fs.createWriteStream(targetPath);
                console.log('BEFORE PIPING')
                src.pipe(dest)
                src.on('error',(err)=>{
                    return res.render('error', {
                        message: err.message,
                        error: {},
                        title: 'Error uploading image'
                    });
                });
                src.on('end', ()=>{
                    var imageData = {
                        imgItemName: items['originalname'],
                        itemId: req.res.locals.newItemId,
                        imgItemCover: false
                    }
                    console.log('BEFORE CREATING IMAGE')
                    imagearray.push(imageData)

                    // resize image
                    jimp.read(targetPath).then((img)=>{
                        img.resize(400,jimp.AUTO)
                        img.write(targetPath)
                        console.log('resized image')
                    }).catch((err)=>{
                        return res.render('error', {
                            message: err.message,
                            error: {},
                            title: 'Error uploading image'
                        });
                    })
                    console.log(items)
                    console.log('ITEM CREATED')
                    fs.unlink(tempPath, (err)=>{
                        if (err)
                            console.log(err)
                    })
                })
            })
            // return next();
        })
    })
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