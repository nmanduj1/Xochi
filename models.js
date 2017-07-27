'use strict';
const config = require('./config.js').db; // pulls only db object from config file
const Sequelize = require('sequelize');

let seqModel = function() { // store as function in order to export the guts out of this file.

// establishing deets for Sequelize to connect to DB.

    const sequelize = new Sequelize(config.db_app_name, config.db_username, config.db_pw, {
        host: '192.168.29.131',
        dialect: 'mysql',

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
    });

// basic connection handling after authentication
    sequelize
        .authenticate()
        .then(() => { // returns a promise
            console.log('Connected to DB.');
        })
        .catch(err => {
            console.error("RONG (-*-)' ", err);
        });


 // defining my MODELs using sequelize reference: sequelize.define('name', {attributes}, {options})
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html

// MEDIUM MODEL
    const Medium = sequelize.define('medium', {
        // primaryKey- ID set automatically by Sequelize
        s3_filename: Sequelize.STRING,
        mimetype: Sequelize.STRING,
        caption: Sequelize.TEXT
    });

    Medium.sync(); // asks DB to sync up.  // pass {force: true} as param if giving you problems syncing.


//ALBUM MODEL
    const Album = sequelize.define('album', {
        // primaryKey -ID set automatically by Sequelize
        name: Sequelize.STRING,
        description: Sequelize.STRING
    });

    Album.sync();


    return { // return list of all models so add them here.  duh.
        Medium, // creates key value pair of Medium:value
        Album
    };




};


module.exports = seqModel;
