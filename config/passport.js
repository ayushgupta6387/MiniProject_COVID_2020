const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load user model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new localStrategy({ usernameField: 'email' }, (email, password, done) => {
            // match user
            User.findOne({ email: email })
                .then(user => {

                })
                .catch(err => console.log(err));
        })
    )
}