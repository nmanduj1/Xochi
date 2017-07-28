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

    function retrieve_all_media(request, reponse){
        let album_id = request.params.album_id;

        console.log("getting everything");
    }

    function retrieve_one_medium(request, reponse){
        let album_id = request.params.album_id;

        console.log('getting one');
    }

    function create_medium_in_album(request, reponse){
        let album_id = request.params.album_id;
        let medium_id = request.params.medium_id;
        console.log(album_id, "album id", medium_id, "medium id");
        console.log('creating one');
    }

    function remove_medium_from_album(request, reponse){
        let album_id = request.params.album_id;

        console.log('removing one');
    }

};

module.exports = album_media_routes;