exports.show = function(req, res) {
	// Render home screen
	res.render('brand', {
		title: "Shop",
		user: req.user
	});
};


// upload listing img
exports.uploadBrandImg = (req,res,next) => {
    console.log(req.files['images'])
    console.log(req.body)
    var items = req.files['imageCover'][0]
    var src,dest,targetPath,targetName,tempPath = items.path;
    var type = mime.lookup(items.mimetype);
    var extension = items.path.split(/[. ]+/).pop();
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
            
            ItemImages.create(imageData).then((newImage, created)=>{
                if (!newImage) {
                    return res.render('error', {
                        message: 'Error uploading image',
                        error: {},
                        title: 'Error uploading image'
                    });
                }
            })
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
                var type = mime.lookup(items.mimetype);
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
                    ItemImages.create(imageData).then((newImage, created)=>{
                        if (!newImage) {
                            res.render('error', {
                                message: 'Error uploading image',
                                error: {},
                                title: 'Error uploading image'
                            });
                        }
                    })
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
            return next();
        })
    })
}