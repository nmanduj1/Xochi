'use strict';

const crypto = require('crypto');
const Chance = require('chance');

function generate_email_token() {

    let chance = new Chance();
    let randoWord = chance.word({length: 16});

    console.log(randoWord, "randoword");

    let mykey = crypto.createCipher('aes-128-cbc', randoWord);
    let mystr = mykey.update('abc', 'utf8', 'hex');
    mystr += mykey.final('hex');

    return mystr;


// create expiration date

    /*
    let expires = new Date();
    expires.setHours(expires.getHours() + 6);

    user.resetToken = {
        token: token,
        expires: expires
    };

    return token;
*/

}

module.exports = generate_email_token;

