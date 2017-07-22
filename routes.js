'use strict';

const express = require('express');
const app = express.Router();


const mediaUpload = require('./mediaUploadSpecs.js');
const multer = require('multer');





let everything = function(app) {


    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.jpg')
        }
    });

    var upload = multer({ storage: storage }).single('file');

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
            response.json({
                success: true,
                message: 'Image uploaded!'
            });
        });


        console.log(request.file);
        //next();
        console.log(request.body);
        //mediaUpload("jpeg");

        console.log("add new image");

    }

    function update_caption(request, response) {
        console.log("update deets");
    }

    function delete_medium(request, response) {
        console.log("delete image");
    }
}

module.exports = everything;