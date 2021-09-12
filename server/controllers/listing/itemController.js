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
    // var itemData = {
    //     itemName: req.body.itemName,
    //     itemDesc: req.body.itemDesc,
    //     itemPrice,
    //     oldItemPrice: itemPrice,
    //     itemCondition: req.body.itemCondition,
    //     itemCat: req.body.itemCat,
    //     itemSubCat: subCat,
    //     itemMeet: meetCheck,
    //     itemMeetDesc: req.body.itemMeetDesc,
    //     itemMail: mailCheck,
    //     itemMailDesc: req.body.itemMailDesc,
    //     itemMailPrice,
    //     userId: req.user.userId,
    // }

    var itemData = {
        user: req.user.id,
        title: req.body.title,
        desc: req.body.desc,
        price: req.body.price
    }
    console.log("myItem" + itemData)
    // create item
    try {
        await Item.create(itemData).then(data => {
            return res.redirect('/c')
        })  
    } catch (err) {
        console.error(err)
    }
    
    // ItemModel.create(itemData).then((newRecord, created)=> {
    //     if (!newRecord) {
    //         return res.render('error', {
    //             message: 'The item was not created',
    //             error: {},
    //             title: 'Item not created'
    //         });
    //     }
    //     console.log('AFTER CREATING ITEM DATA')
    //     // for next() usage
    //     res.locals.newItemId = newRecord['itemId'];
    //     // notify followers of new item
    //     Users.findById(req.user.userId).then((creator)=>{
    //         FollowUser.findAll({where:{following:req.user.userId}}).then((followers)=>{
    //             if (followers.length>0){
    //                 var io = res.locals.socketio
    //                 var nsp = io.of('/online')
    //                 console.log('about to emit')
    //                 for (var i=0;i<followers.length;i++){
    //                     NotifSet.findOne({where:{userId:followers[i].followedBy}}).then((notifSet)=>{
    //                         if (notifSet.showNewItems){
    //                             Notifications.create({
    //                                 notifType: 'followingNewItem',
    //                                 notifDesc: `listed an item:`,
    //                                 userId: notifSet.userId,
    //                                 itemId: newRecord.itemId,
    //                                 notifierUsername: creator.username,
    //                                 itemName: newRecord.itemName
    //                             }).then((emitToUser,created)=>{
    //                                 Users.findOne({where:{userId:emitToUser.userId}}).then((username)=>{
    //                                     nsp.to(username.username+username.userId).emit('Notifications',emitToUser.get({plain: true}))
    //                                     console.log('emitted to',username.username)
    //                                 })
    //                             })
    //                         }
    //                     })
    //                 }
    //             }
    //         })
    //     })
    //     next();
    // })
}

// upload listing img
exports.uploadItemImg = (req,res,next) => {
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