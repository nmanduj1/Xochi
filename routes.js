'use strict';

const express = require('express');
const app = express.Router();
let fs = require('fs');
const model = require('./models.js');
const models = model();

const mediaUpload = require('./mediaUploadSpecs.js');
const multer = require('multer');





let everything = function(app) {


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
            if (err){
            }
            console.log(request.file, "cgfhvjbknl");

            // reading file path
            let s3_fileStream = fs.createReadStream(request.file.path);
            let s3_filePath = request.file.path;
            let mimetype = (request.file.mimetype);

            // sending the file path to aws.
            let DB_storage_name = mediaUpload('jpg', s3_fileStream);

            models.Medium.create({s3_filename: DB_storage_name, mimetype: mimetype});

            //mediaUpload('jpg', request.file.path);
            //let filePathName = fs.open(request.file.path, 'r', send2AWS);

            response.json({
                success: true,
                message: 'Image uploaded!'
            });
        });
        console.log("add new image");

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