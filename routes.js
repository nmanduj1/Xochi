'use strict'

const express = require('express');

const app = express();


let everything = function(app) {
// setting up my Express Routes

    app.get('/media', show_all);
    app.post('/media', add_medium);
    app.put('/media/:id', update_caption);
    app.delete('/media/:id', delete_medium);

// detailing my core route CALLBACK FUNCTIONS

    function show_all(request, response) {
        console.log("show everything");
    }

    function add_medium(request, response) {
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