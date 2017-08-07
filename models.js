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



//ALBUM MODEL
    const Album = sequelize.define('album', {
        // primaryKey -ID set automatically by Sequelize
        name: Sequelize.STRING,
        description: Sequelize.STRING
    });



//USER MODEL
    const User = sequelize.define('user', {
       first_name: Sequelize.STRING,
       last_name: Sequelize.STRING,
       user_name: Sequelize.STRING,
       password: Sequelize.STRING,
       email: Sequelize.STRING,
       token: Sequelize.TEXT,
       signed_key: Sequelize.TEXT
    });




// RELATIONSHIP DEFINITIONS:
    // Many to Many Relationship (Many albums to many medium)
    Medium.belongsToMany(Album, {through: 'AlbumMedia'});  // creates association between medium and album models via AlbumMedia table in DB
    Album.belongsToMany(Medium, {through: 'AlbumMedia'}); // creates association between album and medium models via AlbumMedia table in DB

    // One to Many Relationship (One user to many album)
    User.hasMany(Album);
    Album.belongsTo(User);

    // One to Many Relationship (One user to many medium)
    User.hasMany(Medium);
    Medium.belongsTo(User);


    Medium.sync(); // asks DB to sync up.  // pass {force: true} as param if giving you problems syncing.
    User.sync();
    Album.sync();

    sequelize.sync(); // creates and syncs AlbumMedia tables.  Or however many relationship tables you happen to have.



// Exiting file
    return { // return list of all models so add them here.  duh.
        Medium, // creates key value pair of Medium:value
        Album,
        User
    };
};


module.exports = seqModel;
