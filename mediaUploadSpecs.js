'use strict';

const AWS = require('aws-sdk');
const config = require('./config.js').aws; // pulls only aws object from config file

// sending credentials below as parameters per http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
const s3 = new AWS.S3({accessKeyId: config.aws_access_key_id, secretAccessKey: config.aws_secret_access_key});

// I'm uploading images using putObject from AWS documentation found here : https://aws.amazon.com/sdk-for-node-js/
//
// I think you can also use the code below that (  .upload()  )- based on aws doc found here :
// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
// not sure what the difference is between them.  *scribbles in to-do list*

let guts = function(ext, fileDescriptor){

    // am thinking of setting this into a promise.  mmm, lemme commit first, just in case

    let promising_away = new Promise((resolve, reject) => {
        let internal_random_file_name = Math.floor(Math.random() * (9999999 - 234567) + 234567) + ext;
        let params = {Bucket: 'my-goddamn-xochi-media', Key: internal_random_file_name, Body: fileDescriptor};
        let errorMsg = 'you idiot';

        s3.putObject(params, function(err, data) {
            if (err) {
                reject(
                    errorMsg
                    //console.log("error");
                )
            }
            else {
                resolve (
                    internal_random_file_name
                    //console.log("Successfully uploaded data to my-goddamn-xochi-media using this key:" + randKey);
                )
            }
        });
    });

    return promising_away;
    /*
        let params = {Bucket: 'my-goddamn-xochi-media', Key: randKey, Body: fileDescriptor};
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err)
            }
            else {

                console.log("Successfully uploaded data to my-goddamn-xochi-media using this key:" + randKey);
            }
        });
    */

    /*
    var params = {Bucket: 'my-goddamn-xochi-media', Key: randKey, Body: fileDescriptor};
    var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
    s3.upload(params, options, function(err, data) {
        console.log(err, data);
    });
    */


};

let moreGuts = function(objectParams) {
    let params = {Bucket:'my-goddamn-xochi-media', Key: objectParams.s3_filename};
    let url = s3.getSignedUrl('getObject', params);
    //console.log('The URL is', url);
    //let updated_object = objectParams.signed_url = url;
    return url;
};


function sending_stuff(to_who, unique_email_token) {

    AWS.config.update({region: 'us-east-1'});

    let SES = new AWS.SES();
    let params = {
        Destination: {
            ToAddresses: to_who
        },
        Source: 'nancy@aceldev.com',
        Message: {
            Body: {
                Text: {
                    Data: 'Hello world'  + unique_email_token
                }
            },
            Subject: {
                Data: 'Hello world'
            }
        }
    };
    SES.sendEmail(params, , function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
}


module.exports = {
  upload_media : guts,
  signed_url: moreGuts,
  send_email: sending_stuff
};