'use strict';

const AWS = require('aws-sdk');
const config = require('./awsConfig.js');
const s3 = new AWS.S3({accessKeyId: config.aws_access_key_id, secretAccessKey: config.aws_secret_access_key});

let guts = function(ext){

    let randKey = Math.floor(Math.random() * (9999999 - 234567) + 234567) + "." + ext;
    let params = {Bucket: 'my-goddamn-xochi-media', Key: randKey, Body: 'Hello! <- not sure why the ello.'};
    s3.putObject(params, function(err, data) {
        if (err) {
            console.log(err)
        }
        else {
            console.log("Successfully uploaded data to my-goddamn-xochi-media using as this key:" + randKey);
        }
    });

    /*
    var params = {Bucket: 'bucket', Key: 'key', Body: stream};
    var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
    s3.upload(params, options, function(err, data) {
        console.log(err, data);
    });
    */
};



module.exports = guts;