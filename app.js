const express = require("express");

// const expressLayouts = require('express-ejs-layouts');

const mongoose = require("mongoose");

const flash = require("connect-flash");
const session = require("express-session");
var passport = require("passport");

const request = require("request");

const app = express();
// Passport config
require("./config/passport")(passport);

const bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());



// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();

});

// DB config
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// app.use(expressLayouts);
app.set("view engine", "ejs");
// app.use(express.static("public"));
app.use(express.static(__dirname + "/public"));

// app.get("/", (req, res) => {
//   res.render("home");
// });

// app.get("/sign", (req, res) => {
//   res.render("signin");
// });

// app.get("/register", (req, res) => {
//   res.render("signup");
// });

// post method for signup page
// app.post("/signup", (req, res) => {
//   var name = req.body.username;
//   var email = req.body.useremail;
//   var password = req.body.userpassword;
//   console.log(req.body);
//   res.send(
//     "Finally: name is: " +
//       name +
//       "email is: " +
//       email +
//       "password is: " +
//       password
//   );
// });

// post method for signin page
// app.post("/signin", (req, res) => {
//   var email = req.body.useremail;
//   var password = req.body.userpassword;

//   console.log(req.body);
//   res.send("email is: " + email + "password is: " + password);
// });

app.get("/covidlive", (req, res) => {
  const url = "https://api.covid19india.org/data.json";


  request(url, (error, response, body) => {

    // Error - Any possible error when
    // request is made.

    // Eesponse - HTTP response status codes
    // indicate whether a specific HTTP
    // request has been successfully completed

    // body - response data

    // 200 - successful response

    request(url, (error, response, body) => {

      if (!error && response.statusCode == 200) {
        body = JSON.parse(body);


        //The data have lot of extra properties
        // We will filter it


        let data = [];
        for (let i = 0; i < body.statewise.length; i++) {
          data.push({
            State: body.statewise[i].state,

            Confirmed: body.statewise[i].confirmed,

            Active: body.statewise[i].active,

            Recovered: body.statewise[i].recovered,

            Death: body.statewise[i].deaths,
          });
        }

        console.log("-----Total Cases in India " + "and in each state-----");
        console.log(data);
        //Format to table
        console.table(data);
        res.render("covidLive", {
          state: body.statewise,
        });
      }
    });
  });
});


// using routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log(`Server has started successfully on port ${port}`);
});
