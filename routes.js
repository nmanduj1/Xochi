'use strict';

const express = require('express');
let fs = require('fs');
const model = require('./models.js');
const models = model();
const Sequelize = require('sequelize');

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
    app.get('/media/random', show_random);
    app.post('/media', add_medium);
    app.put('/media/:id', update_caption);
    app.delete('/media/:id', delete_medium);

// detailing my core route CALLBACK FUNCTIONS

    function show_all(request, response) {
        models.Medium.findAll().then(
            all_media => {
                response.send(all_media);
                response.end();
            },
            err => {
                response.statusCode = 400; // bad request
            }
        );
    }


    function show_random(request, response){
        models.Medium.findOne({ order: [[Sequelize.fn('RAND')]] }).then(
            lucky_one => {
                response.send(lucky_one);
                response.end();
            },
            err => {
                response.statusCode = 400;
                //console.log(err);
                response.end();
            }
        );
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
            let upload_promise = mediaUpload(extentions_name[0], s3_file_stream);

            // oops, we still need to upload to the DB- in order to do that, we need to pull out a few more things from the request, the mimetype and the caption
            let mimetype = (request.file.mimetype); // pulling out mimetype stuffs
            let medium_caption = request.body.caption;
            upload_promise.then(
                function (internal_random_file_name/* this corresponds to the randKey that is being returned by the promise in my mediaUploadSpecs.js file */) {
                    models.Medium.create({s3_filename: internal_random_file_name, mimetype: mimetype, caption: medium_caption}).then(
                        made_it => {
                            response.send(
                                made_it
                            )
                        }
                    ); // downside, always creating. mod this with promise to check for duplicate


                },
                function (error) {
                    console.log(error);
                }

            );



            //mediaUpload('jpg', request.file.path);
            //let filePathName = fs.open(request.file.path, 'r', send2AWS);

            //response.json({
            //    success: true,
            //    message: 'I did my part! fuck knows if file uploaded or not'
            //});
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
        // grab id of medium that is being updated:
        let id_im_updating = request.params.id;
        console.log(id_im_updating, "update deets for this thingy");

        // this mess grabs the body of the request.  #fml seriously.
        request.on('data', (chunk) => {
            let decoded_buffer = chunk.toString();
            console.log(decoded_buffer, "DATA");
            //let regex_key_search = new RegExp(/(?:(?!=).)*/);
            let regex_value_search = new RegExp(/=\w+/);

            //let key_to_update = decoded_buffer.match(regex_key_search);
            let value_to_update = decoded_buffer.match(regex_value_search);

            //let final_key = key_to_update[0];
            let almost_final_value = value_to_update[0];

            console.log(almost_final_value, "huirhgijknbglwkjrnbgije");

            let splitstr = almost_final_value.split('=');
            let final_value = splitstr[1];

            let thing_2_update =
                models.Medium.update({
                        caption : final_value
                    }, {
                        where: {
                            id: id_im_updating
                        }
                    }
                );

            thing_2_update.then(
                updated_medium => {
                    response.send(updated_medium);
                    console.log(updated_medium, "not sure whats going on here")
                    response.end();
                },
                err => {
                    response.statusCode = 400;
                }
            );

        });
    }


        // need regEx to get the key and the value.  because the thing doesn't come in as a json object.



    function delete_medium(request, response) {
        console.log("delete image");
    }
}

module.exports = everything;





















