const express = require('express');
const app = express();
const routes = require('./routes');


routes(app);
// Setup CORS permissions

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


function listening(){
    console.log("shoulder for you to cry upon");
}


app.listen(8080, listening);