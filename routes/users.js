const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// user model
const User = require('../models/User');


router.get('/login', (req, res)=> res.render('signin'));
router.get('/register', (req, res)=> res.render('signup'));

// get data typed on register page
// handle register page
router.post('/register', (req, res) => {

    // destructuring
    const { name, email, password, password2 } = req.body;
    let errors = [];

// ---------------------------------------------------- APPLY VALIDATIONS

    // check required fields
    // passing msg as an object
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill all required fields' });
    }

    // check password match
    if (password !== password2) {
        errors.push({ msg: 'Password do not match' });
    }

    // check pass length
    if(password.length < 6) {
        errors.push( {msg: 'Password must be at least 6 characters long'} )
    }

    if (errors.length > 0) {
       // if any above cond. will become true then
       res.render('signup', {
           errors,
           name,
           email,
           password,
           password2
       })
    }else{
        // validation passed
        // check if already exist
        User.findOne({ email: email })
        .then( user => {
            if(user){
                // user exists send this error
                errors.push({ msg: 'Email is already registered' });
                res.render('signup', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name, 
                    email,
                    password
                });
            //  hash password
  
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then(user => {
                        // flash will store msg into session and shows after redirect
                      req.flash(
                        'success_msg',
                        'You are now registered and can log in'
                      );
                      res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                });
              });
            }
          });
        }
      });

// handle login page
router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});



module.exports = router;