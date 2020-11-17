const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// user model
const User = require("../models/User");
const Form = require("../models/form");

router.get("/login", (req, res) => res.render("signin"));
router.get("/register", (req, res) => res.render("signup"));
// router.get("/saveform", checkAuthentication,(req, res) => res.render("form"));
router.get("/saveform", checkAuthentication,(req, res) => res.render("form", {
  name: req.user.name
}));

// get data typed on register page
// handle register page
router.post("/register", (req, res) => {
  // destructuring
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // ---------------------------------------------------- APPLY VALIDATIONS

  // check required fields
  // passing msg as an object
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill all required fields" });
  }

  // check password match
  if (password !== password2) {
    errors.push({ msg: "Password do not match" });
  }

  // check pass length
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters long" });
  }

  if (errors.length > 0) {
    // if any above cond. will become true then
    res.render("signup", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // validation passed
    // check if already exist
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // user exists send this error
        errors.push({ msg: "Email is already registered" });
        res.render("signup", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        //  hash password

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                // flash will store msg into session and shows after redirect
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// handle login page
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/saveform",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});





router.post("/saveform", (req, res)=>{
  // const {username} = req.body;
  if(req.isAuthenticated()){
    const newData = new Form({
      name: req.body.username,
      suggestion: req.body.mysuggestion
    }) 
    newData.save(function(err){
     if(err){
       console.log(err);
     }else{
       res.render('home')
     }
    })
  }
})



function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      //req.isAuthenticated() will return true if user is logged in
    // res.redirect("/users/saveform")
      next();
  } else{
      res.redirect("/users/login");
  }
}
















// handle logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
