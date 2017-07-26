'use strict';

const express = require('express');
const fs = require('fs');
const model = require('../models.js');
const models = model();
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const AWS_guts = require('../mediaUploadSpecs.js');
const multer = require('multer');



let album_routes = function(app) {

// setting up my Express Routes for albums

    app.get('/albums', show_all_albums);
    app.post('/albums', add_album);
    app.put('/albums/:id', update_album_details);
    app.delete('/albums/:id', delete_album);


// guts to parse requests.  Body parser specifically tackles PUT requests (which #meh.  but, taking into account that
// incoming PUT requests should only be incoming single part text, so body parser is enough.
// Multer handles multipart data form submission - aka both files and captions.
// Both of these are set up below.

    app.use(bodyParser.urlencoded({ extended: false }));

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


//  Core route CALLBACK FUNCTIONS for Album/Albums

    function show_all_albums(request, response){
        console.log("show all albums");
    }

    function add_album(request, response){
        console.log("add album");
    }

    function update_album_details(request, response){
        console.log("update album")
    }

    function delete_album(request, response){
        console.log("delete album");
    }


};

module.exports = album_routes;





















