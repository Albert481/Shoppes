const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
const path = require('path');

const s3 = new aws.S3();

var config = new aws.Config({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: process.env.S3_ACCESS_REGION });

aws.config.update(config);


module.exports = {
    deleteItemImageByKey: function(imgkey) {
        s3.deleteObject({ Bucket: 'shoppes-itemimages', Key: imgkey }, (err, data) => {
            console.error(err);
            console.log(data);
        });
    }
}
