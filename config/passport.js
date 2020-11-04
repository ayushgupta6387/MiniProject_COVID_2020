const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load user model
const User = require('../models/User');
const { isMatch } = require('lodash');

module.exports = function(passport) {
    passport.use(
        new localStrategy({ usernameField: 'email' }, (email, password, done) => {
            // match user
            User.findOne({ email: email })
                .then(user => {
                    if(!user){
                        // error user msg
                        return done(null, false, { message: 'That email is not registered' })
                    }

                    // match password
                    // decrypt password to check  (user.password - hashed password [user coming from db]) 
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch){
                            return done(null, user);
                        }else{
                            return done(null, false, { message: 'Password incorrect' })
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}