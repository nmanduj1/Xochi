'use strict';

const express = require('express');
const fs = require('fs');
const model = require('../models.js');
const models = model();
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const AWS_guts = require('../mediaUploadSpecs.js');



let album_routes = function(app) {

// setting up my Express Routes for albums

    app.get('/albums', show_all_albums);
    app.post('/albums', add_album);
    app.put('/albums/:id', update_album_details);
    app.delete('/albums/:id', delete_album);


// guts to parse requests.  Body parser specifically tackles PUT requests (which #meh.  but, taking into account that
// incoming PUT requests should only be incoming single part text, so body parser is enough.


    app.use(bodyParser.urlencoded({ extended: false }));


//  Core route CALLBACK FUNCTIONS for Album/Albums

    function show_all_albums(request, response){
        models.Album.findAll().then(
            all_albums => {
                response.send(all_albums);
                response.end();
            },
            err => {
                response.send(err);
                response.statusCode = 400; // bad request
            }
        );
        console.log("show all albums");
    }

    function add_album(request, response){
        let album_create_name = request.body.name;
        let description = request.body.description;

        models.Album.create({name: album_create_name, description: description}).then(
            album_created => {
                response.send(
                    album_created
                )
            },
            err => {
                response.send(err);
                response.statusCode = 400;
            }
        );
    }

    function update_album_details(request, response){
        let album_update_id = request.params.id;
        let details_update = request.body;

        let album_update =
            models.Album.update(
                details_update
                , {
                    where: {
                        id: album_update_id
                    }
                }
            );

        album_update.then(
            () => {
                response.statusCode = 200;
                response.end();
            },
            err => {
                response.statusCode = 400;
                response.end();
            }
        );
    }

    function delete_album(request, response){
        let album_delete_id = request.params.id;

        let destroy =
            models.Album.destroy({
                where: {
                    id : album_delete_id
                }
            });

        destroy.then(
            destroyed_album => {
                response.statusCode = 204;
                response.end(console.log("it has been reduced to non-existence"));
            },
            error => {
                response.statusCode = 422;
                response.end(error);
            }
        )
    }

};

module.exports = album_routes;





















