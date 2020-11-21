const express = require("express");
var $ = require('jquery')
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


app.get("/covidlive", (req, res) => {
  const urls = "https://api.covid19india.org/data.json";
  request(urls, (error, response, body) => {

    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);

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
      // console.log(data);
      //Format to table
      // console.table(data);
      res.render("covidLive", {
        state: body.statewise,
      });
    }
  });
});

app.get("/countrylive", (req, res)=>{
    const url = "https://api.covid19api.com/summary";
    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            // console.log(body);
            // console.table(body.Global);
            let countryData = [];
            for (let i = 0; i < body.Countries.length; i++) {
             countryData.push({
               Country: body.Countries[i].Country,
               Confirmed: body.Countries[i].TotalConfirmed,
               Active: body.Countries[i].Active,
               Deaths: body.Countries[i].TotalDeaths,
               Recovered: body.Countries[i].TotalRecovered
             })

            }
            // console.table(body.Countries[7].Country);
            // console.log(body.Countries[0].NewConfirmed);
            // console.log(countryData)
            res.render("countrylive", {
              allData: body.Countries,
            })
        }
        })
      });






app.get('/gdp', (req, res) => {
  res.render('gdp')
});

app.get('/home', (req, res) => {
  res.render('home')
});

app.get('/history', (req, res) => {
  res.render('history')
});

app.get('/covidintro', (req, res) => {
  res.render('covidintro')
});
app.get('/chart', (req, res) => {
  res.render('chart')
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
