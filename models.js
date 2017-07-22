'use strict';


const Sequelize = require('sequelize');

let seqModel = function() {
    const sequelize = new Sequelize('xochi_app', 'guzzi', 'rescue', {
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

    const Medium = sequelize.define('medium', {
        // primaryKey- ID set automatically by Sequelize
        s3_filename: Sequelize.STRING,
        caption: Sequelize.TEXT
    });

    Medium.sync(); // asks DB to sync up.

    return { // return list of all models so add them here.  duh.
        Medium // creates key value pair of Medium:value

    }

};


module.exports = seqModel;
