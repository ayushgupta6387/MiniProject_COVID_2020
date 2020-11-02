const e = require('express');
const express = require('express');
const router = express.Router();

// user model
const User = require('../models/User');

router.get('/login', (req, res)=> res.render('signin'));
router.get('/register', (req, res)=> res.render('signup'));

// get data typed on register page
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
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                
            }
        })
    }

})

module.exports = router;