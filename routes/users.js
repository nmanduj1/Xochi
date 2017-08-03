'use strict';

const express = require('express');
const fs = require('fs');
const model = require('../models.js');
const models = model();
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');



let user_routes = function(app) {

// setting up my Express Routes for users

    app.post('/user/new', create_user_account);
    app.get('/user/:user_id', display_user_specs);
    app.put('/user/:user_id', update_user_info);
    app.delete('/user/:user_id', delete_user);

// guts to parse requests
    app.use(bodyParser.urlencoded({ extended: false }));

// Core route CALLBACK FUNCTIONS for Users

    function create_user_account(request, response) {
        let first_name = request.body.first_name;
        let last_name = request.body.last_name;
        let user_name = request.body.user_name;
        let email = request.body.email;
        let password = request.body.password;
        //console.log(first_name, "hello");

        models.User.create({
            first_name: first_name,
            last_name: last_name,
            user_name: user_name,
            email: email,
            password: password
        }).then(
            user_created => {
                response.send(
                    user_created
                )
            },
            err => {
                response.send(err);
                response.statusCode = 400;
            }
        );

    }

    function display_user_specs(request, response) {
        console.log("hello");
    }

    function update_user_info(request, response) {
        console.log("hello");
    }

    function delete_user(request, response) {
        let userId_to_delete = request.params.user_id;
        console.log(userId_to_delete, "ID TO DELETE HERE");

        let destroy =
            models.User.destroy({
                where: {
                    id : userId_to_delete
                }
            });

        destroy.then(
            destroyed_profile => {
                response.statusCode = 204;
                response.end(console.log("it has been reduced to non-existence"));
            },
            error => {
                response.statusCode = 422;
                response.end(error);
            }
        );

        console.log("hello");
    }


};

module.exports = user_routes;