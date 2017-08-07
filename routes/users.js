'use strict';

const express = require('express');
const fs = require('fs');
const model = require('../models.js');
const models = model();
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const token_specs = require('../token_details.js');
const nJwt = require('njwt');
const secureRandom = require('secure-random');
const validator = require('validator');
const _ = require("underscore");

let user_routes = function(app) {

// setting up my Express Routes for users

    app.post('/user/new', create_user_account);
    app.post('/user/go', signing_in);
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

        if (validator.isEmail(email)) {
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
        else {
            let wrong = "not valid email";
            response.send(wrong);
            response.end();
        }
    }

    function signing_in(request, response){
        let user_email = request.body.email;
        let user_pwd = request.body.password;

        models.User.findOne({
            where: {
                email: user_email,
                password: user_pwd
            }
        }).then(user => {
            let user_id = user.id;
            let token_deets = token_specs(user_id);
            let token = token_deets.token;
            let signKey = token_deets.base64SigningKey;
            user.token = token;
            user.signed_key = signKey;
            user.save().then(() => {
                response.send(user);
                response.end();
            });

            console.log(user);
        })
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
        console.log(request.headers, "HEADERSSSS");
        let user_token = request.headers.authorization;
        console.log(details_update, "STUFF TO UPDATE");

        let key_arr = Object.keys(details_update);
        console.log(key_arr, "KEEYS TO BE CHANGED");

        let verified_key_val = {};

        _.each(key_arr, function(key, value) {
            console.log(key, "Keys SUPPOSEDLY");
            console.log(value, "values SUPPOSEDLY");
            switch(key) {
                case 'email':
                    let email_val = details_update.email;
                    console.log(email_val, "TESTING");
                    if (validator.isEmail(email_val)) {
                        console.log(verified_key_val.email, "YOU ARE HERE");
                        verified_key_val.email = email_val;
                        console.log('troof');
                        break;
                    }
                    else {
                        response.statusCode = 400;
                        response.end();
                        console.log("invalid email address");
                    }

                default:
                    verified_key_val[key] = details_update[key];
                    console.log("fuck me");
                    break;
            }

            console.log(verified_key_val, "AVER QUE PASA");


            models.User.findOne({
                where: {
                    id: userId_to_update
                }
            }).then(user => {
                console.log(user, "USER");
                let token = user_token;
                let signingKey = user.signed_key;
                console.log(token, "TOKEN");
                console.log(signingKey, "SIGNING KEYYYYY");

                nJwt.verify(token, signingKey, function(err,verifiedJwt){
                    if(err){
                        console.log(err); // Token has expired, has been tampered with, etc
                    }
                    else {
                        console.log(verifiedJwt); // Will contain the header and body
                        let user_update =
                            models.User.update(
                                verified_key_val
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
                });

            });

        });










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