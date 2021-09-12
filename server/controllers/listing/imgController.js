// import modules
var fs = require('fs');
var mime = require('mime');
var jimp = require('jimp')
// image file types
var IMAGE_TYPES = ['image/jpeg','image/jpg','image/png'];

// img models and db
var ItemModel = require('../../models/Item')
//var postImg = require('../models/postImgModel');
//var myDatabase = require('./sqlDatabase');
//var sequelize = myDatabase.sequelize;

//  update profile img
exports.uploadProfileImg = (req,res,next) => {
    if (!req.file){
        req.flash('editFail','An error has occured. Please try again.')
        return res.redirect('/p/accountdetails/edit')
    }
    ProfileImages.findOne({where:{userId:req.user.userId}}).then((oldImg)=>{
        // delete old image
        var deletePath = './public/uploads/images/'+req.user.userId+'/profile/' + oldImg.imgProfileName
        fs.unlink(deletePath,(err)=>{
            if (err)
                console.log(err)
        })
        var src,dest,targetPath,targetName,tempPath = req.file.path;
        var type = mime.lookup(req.file.mimetype);
        var extension = req.file.path.split(/[. ]+/).pop();
        if (IMAGE_TYPES.indexOf(type) == -1){
            return res.status(415).send('Only jpeg, jpg and png are allowed.')
        }
        targetPath = './public/uploads/images/' +req.user.userId+ '/profile/' + req.file.originalname;
        src = fs.createReadStream(tempPath);
        dest = fs.createWriteStream(targetPath);
        src.pipe(dest);
        src.on('error',(err)=>{
            return res.render('error', {
                message: err.message,
                error: {},
                title: 'Error uploading image'
            });
        });
        src.on('end', ()=>{
            var imageData = {
                imgProfileName: req.file.originalname,
            }
            fs.unlink(tempPath, (err)=>{
                if (err)
                    console.log(err)
            })
            // resize image
            jimp.read(targetPath).then((img)=>{
                console.log(img)
                img.scaleToFit(400, 400)
                img.write(targetPath)
                console.log(img)
                console.log('resized image')
            }).catch((err)=>{
                return res.render('error', {
                    message: err.message,
                    error: {},
                    title: 'Error uploading image'
                });
            })
            ProfileImages.update(imageData,{where:{userId:req.user.userId}}).then((newImage, created)=>{
                if (!newImage){
                    return res.send(400),{
                        message: 'error'
                    }
                }
                req.flash('editMsg','You have successfully changed your profile picture')
                return res.redirect('/p/accountdetails/edit')
            })
        })

    })
}

// Group Image upload
exports.uploadGrpImg = (req,res,next) => {
    if (!req.file){
        req.flash('editFail','An error has occured. Please try again.')
        return res.redirect('/admin/groups')
    }
    var src,dest,targetPath,targetName,tempPath = req.file.path;
    var type = mime.lookup(req.file.mimetype);
    var extension = req.file.path.split(/[. ]+/).pop();
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res.status(415).send('Only jpeg, jpg, jpe and png are allowed.')
    }

    targetPath = './public/uploads/images/groups/'+req.res.locals.newGroupId+'/'+req.file.originalname;
    if (!fs.existsSync('./public/uploads/images/groups/'+res.locals.newGroupId)) {       
        fs.mkdirSync('./public/uploads/images/groups/'+res.locals.newGroupId)
    }

    src = fs.createReadStream(tempPath);
    dest = fs.createWriteStream(targetPath);
    console.log('BEFORE PIPING')
    src.pipe(dest)
    src.on('error',(err) => {
        if(err){
            res.render('error', {
                message: 'Error uploading image',
                error: {},
                title: 'Error uploading image'
            });
        }
    });
    src.on('end', ()=>{
        var imageData = {
            groupImgName: req.file.originalname,
            groupId: req.res.locals.newGroupId,
        }
        console.log('BEFORE CREATING IMAGE')
        
        groupImages.create(imageData).then((newImage)=>{
            if (!newImage) {
                res.render('error', {
                    message: err.message,
                    error: {},
                    title: 'Error uploading image'
                });
            }
            res.redirect('/admin/groups')
        })
    })
}

// Social Post Image upload
exports.uploadPostImg = (req,res,next) => {
    req.files['images'].forEach((posts)=> {
        var src,dest,targetPath,targetName,tempPath = posts.path;
        var type = mime.lookup(posts.mimetype);
        var extension = posts.path.split(/[. ]+/).pop();
        if (IMAGE_TYPES.indexOf(type) == -1) {
            return res.status(415).send('Only jpeg, jpg, jpe and png are allowed.')
        }

        targetPath = './public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts/'+req.res.locals.newPostId+'/'+posts.originalname;
        if (!fs.existsSync('./public/uploads/images/'+req.user.userId+'/group')) {       
            fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group')
            
            if(!fs.existsSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id)) {     
                fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id)

                if (!fs.existsSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts')) {
                    fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts')
                    fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts/'+req.res.locals.newPostId)
                } 
                else {
                    fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts/'+req.res.locals.newPostId)
                }
            } 
            else {
                if (!fs.existsSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts')) {
                    fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts')
                    fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts/'+req.res.locals.newPostId)
                } 
                else {
                    fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts/'+req.res.locals.newPostId)
                }
            }
        } 
        else {        
            if(!fs.existsSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id)) {     
                fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id)

                if (!fs.existsSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts')) {
                    fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts')
                    fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts/'+req.res.locals.newPostId)
                } 
                else {
                    fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts/'+req.res.locals.newPostId)
                }
            } 
            else {
                if (!fs.existsSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts')) {
                    fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts')
                    fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts/'+req.res.locals.newPostId)
                } 
                else {
                    if (!fs.existsSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts/'+req.res.locals.newPostId)) {
                        fs.mkdirSync('./public/uploads/images/'+req.user.userId+'/group/'+req.params.group_id+'/posts/'+req.res.locals.newPostId)
                    }
                }
            }
        }
        src = fs.createReadStream(tempPath);
        dest = fs.createWriteStream(targetPath);
        console.log('BEFORE PIPING')
        src.pipe(dest)
        src.on('error',(err) => {
            if(err){
                res.render('error', {
                    message: 'Error uploading image',
                    error: {},
                    title: 'Error uploading image'
                });
            }
        });
        src.on('end', ()=>{
            var imageData = {
                postImgName: posts.originalname,
                postId: req.res.locals.newPostId,
            }
            console.log('BEFORE CREATING IMAGE')
            
            postImg.create(imageData).then((newImage)=>{
                if (!newImage) {
                    res.render('error', {
                        message: err.message,
                        error: {},
                        title: 'Error uploading image'
                    });
                }
            })
        })
    })
    res.redirect('/group/' + req.params.group_name + '/' + req.params.group_id)
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