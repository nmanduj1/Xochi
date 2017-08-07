'use strict';

const nJwt = require('njwt');
const secureRandom = require('secure-random');



let token_creation = function(user_id) {
    const signingKey = secureRandom(256, {type: 'Buffer'}); // Create a highly random byte array of 256 bytes

    const claims = {
        iss: "localhost:8080/",  // The URL of your service
        sub: "user/"+ user_id,    // The UID of the user in your system
        scope: "self, admins"
    };

    let base64SigningKey = signingKey.toString('base64');

    const jwt = nJwt.create(claims, base64SigningKey);
    //console.log(jwt, "JSON WEB TOKEN GUTS");
    const token = jwt.compact();
    //console.log(token, "FORMATTED TOKEN GUTS");


    return {
        token,
        base64SigningKey
    };

};

module.exports = token_creation;