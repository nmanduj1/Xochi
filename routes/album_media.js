'use strict';

const express = require('express');
const model = require('../models.js');
const models = model();
const bodyParser = require('body-parser');

const fs = require('fs');
const multer = require('multer');
const AWS_guts = require('../mediaUploadSpecs.js');
const Sequelize = require('sequelize');


let album_media_routes = function(app) {

// file upload guts - for POST
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






//  setting up my Express Routes for AlbumMedia 'transfer file'
    app.get('/album/:album_id/media', retrieve_all_media);
    app.get('/album/:album_id/media/random', retrieve_random);
    app.get('/album/:album_id/media/:medium_id', retrieve_one_medium);
    app.post('/album/:album_id/media', create_medium_in_album);
    app.delete('/album/:album_id/media/:medium_id', remove_medium_from_album)


// guts to parse requests.

    app.use(bodyParser.urlencoded({ extended: false }));

// Core callback functions for AlbumMedia 'transfer file'

    function retrieve_all_media(request, response){
        let album_id = request.params.album_id;

        let find_album = models.Album.findOne({
            where: {
                id: album_id
            }
        });

         find_album.then(found_album => {
            found_album.getMedia().then(guts => {
                response.send(guts);
                response.statusCode = 200;
                response.end();
            });
        });
    }

    function retrieve_one_medium(request, response){
        let album_id = request.params.album_id;
        let medium_id = request.params.medium_id;

        let find_album = models.Album.findOne({
            where: {
                id: album_id
            }
        });

        find_album.then(found_album => {
            found_album.getMedia({
                where: {
                    id: medium_id
                }
            }).then(single_file => {
                    response.send(single_file);
                    response.statusCode = 200;
                    response.end();
            })
        });
    }

    function retrieve_random(request, response){
        let album_id= request.params.album_id;

        let find_album = models.Album.findOne({
            where: {
                id: album_id
            }
        });

        find_album.then(found_album => {
            found_album.getMedia( { order: [[Sequelize.fn('RAND')]] } ).then(
                lucky_one => {
                    console.log(lucky_one[0], "HERE");
                    let only_signed_url = AWS_guts.signed_url(lucky_one[0]); // generates signed url
                    let plain_object_model = lucky_one[0].get({plain: true}); // removes sequelizer crap to give you actual values in object
                    plain_object_model.signed_url = only_signed_url; // setting up key/value pair to store in main object: key = ('plain_object_model') value = stuff returned by only_signed_url
                    response.send(plain_object_model); // sends back new object with updated key-value pairs.
                    response.end();
                },
                err => {
                    response.statusCode = 400;
                    response.end();
                }
            )
        });
    }


    function create_medium_in_album(request, response){
        let album_id = request.params.album_id;

        let find_album = models.Album.findOne({
            where: {
                id: album_id
            }
        });

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
            let upload_promise = AWS_guts.upload_media(extentions_name[0], s3_file_stream);

            // oops, we still need to upload to the DB- in order to do that, we need to pull out a few more things from the request, the mimetype and the caption
            let mimetype = (request.file.mimetype); // pulling out mimetype stuffs
            let medium_caption = request.body.caption;


            upload_promise.then(
                function (internal_random_file_name/* this corresponds to the randKey that is being returned by the promise in my mediaUploadSpecs.js file */) {
                    models.Medium.create({s3_filename: internal_random_file_name, mimetype: mimetype, caption: medium_caption}).then(
                        made_it => {
                            find_album.then(found_album => {
                                found_album.addMedium(made_it).then(thing => {
                                    response.send(made_it);
                                    response.statusCode = 200;
                                    response.end();
                                });
                            });
                        }
                    ); // downside, always creating. mod this with promise to check for duplicate
                },
                function (error) {
                    console.log(error);
                }
            );
        });

    }





    function remove_medium_from_album(request, response){
        let album_id = request.params.album_id;
        let medium_id = request.params.medium_id;

        let find_album = models.Album.findOne({
            where: {
                id: album_id
            }
        });

        find_album.then(found_album => {
            found_album.getMedia({
                where: {
                    id:medium_id
                }
            }).then(thing => {
                found_album.removeMedia(thing).then(() => {
                    response.statusCode = 200;
                    response.end();
                })
            })
        });
    }

};

module.exports = album_media_routes;