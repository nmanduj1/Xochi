'use strict';

const express = require('express');
const model = require('../models.js');
const models = model();
const bodyParser = require('body-parser');



let album_media_routes = function(app) {

//  setting up my Express Routes for AlbumMedia 'transfer file'
    app.get('/album/:album_id/media', retrieve_all_media);
    app.get('/album/:album_id/media/:medium_id', retrieve_one_medium);
    app.post('/album/:album_id/media/:medium_id', create_medium_in_album);
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

    function create_medium_in_album(request, reponse){
        //let album_id = request.params.album_id;
        //let medium_id = request.params.medium_id;
        console.log(album_id, "album id", medium_id, "medium id");
        //console.log('creating one');
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