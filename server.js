'use strict'

const express = require('express');
//const routes = require('./routes');
const media_routes = require('./routes/media.js');  // slash at the end means its a folder. no slash means its a file
const album_routes = require('./routes/albums.js');
const album_media_routes = require('./routes/album_media.js');
const model = require('./models.js');

const app = express();



// Setup CORS permissions

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//routes(app);
media_routes(app);
album_routes(app);
album_media_routes(app);

// running and testing my models/schemas

let allModels = model();
let mediumThingy = allModels.Medium;
let albumThingy = allModels.Album;
//console.log(mediumThingy, "MODELS MEDUIMMMMM");


function listening(){
    console.log("share your vanities.");
}

app.listen(8080, listening);