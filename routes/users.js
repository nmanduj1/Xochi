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
        let user_details_view = request.params.user_id;

        models.User.findOne({
            where: {
                id: user_details_view
            }
        }).then(user_specs => {
            response.send(user_specs);
            response.statusCode = 200;
            response.end();
        });

    }

    function update_user_info(request, response) {
        let userId_to_update = request.params.user_id;
        let details_update = request.body;
        console.log(details_update, "STUFF TO UPDATE");

        let user_update =
            models.User.update(
                details_update
                , {
                    where: {
                        id: userId_to_update
                    }
                }
            );

        user_update.then(
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