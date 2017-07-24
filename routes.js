'use strict';

const express = require('express');
let fs = require('fs');
const model = require('./models.js');
const models = model();

const mediaUpload = require('./mediaUploadSpecs.js');
const multer = require('multer');





let everything = function(app) {

    // doc from https://github.com/an0nh4x0r/youtube_fileupload/blob/master/routes/profile.js
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.jpg')
        }
    });

    let upload = multer({ storage: storage }).single('file');



// setting up my Express Routes

    app.get('/media', show_all);
    app.post('/media', add_medium);
    app.put('/media/:id', update_caption);
    app.delete('/media/:id', delete_medium);

// detailing my core route CALLBACK FUNCTIONS

    function show_all(request, response) {
        console.log("show everything");
    }

    function add_medium(request, response, next) {
        upload(request, response, function(err){
            if (err) {
                response.json({
                    success: false,
                    message: 'Image not uploaded!'
                });
            }

            // Playing with data received
            let s3_file_stream = fs.createReadStream(request.file.path);  // pulling out file path guts
            // next, need to figure out file extension.  Using regular expression to look for extention of original file.
            let filename = request.file.originalname; // pulling name of file 2bUsed for extention specification
            let regex_ext_search_query = new RegExp(/\.[a-zA-Z]{3,4}/); // dictating query to be searched for
            let extentions_name = filename.match(regex_ext_search_query); // .match returns array with stuffs. first indicie holds match

            // now that we have both the EXTENSION AND THE FILE STREAM, we can send these to aws.
            let db_storage_name = mediaUpload(extentions_name[0], s3_file_stream);

            // oops, we still need to upload to the DB- in order to do that, we need to pull out a few more things from the request, the mimetype and the caption
            let mimetype = (request.file.mimetype); // pulling out mimetype stuffs
            let medium_caption = request.body.caption;
            models.Medium.create({s3_filename: db_storage_name, mimetype: mimetype, caption: medium_caption}); // downside, always creating. mod this with promise to check for duplicates

            //mediaUpload('jpg', request.file.path);
            //let filePathName = fs.open(request.file.path, 'r', send2AWS);

            response.json({
                success: true,
                message: 'Image uploaded!'
            });
        });
    }

    /*
    function send2AWS(err, fileDescriptor) {
        // file descriptor is pointer to file
        console.log(fileDescriptor, "FILE HERE");
        mediaUpload('jpg', fileDescriptor);
    }
    */


    function update_caption(request, response) {
        console.log("update deets");
    }

    function delete_medium(request, response) {
        console.log("delete image");
    }
}

module.exports = everything;