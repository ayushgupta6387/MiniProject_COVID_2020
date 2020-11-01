const express = require("express");

// const expressLayouts = require('express-ejs-layouts');

const request = require("request");

const app = express();


const bodyParser = require("body-parser");
const { Router } = require("express");

app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use(expressLayouts);
app.set('view engine', 'ejs');
// app.use(express.static("public"));  
app.use(express.static(__dirname + '/public'));

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
app.post("/signup", (req, res) => {
  var name = req.body.username;
  var email = req.body.useremail;
  var password = req.body.userpassword;
  // getting only on server
  console.log(req.body);
  // getting on page also users data
  res.send("Finally: name is: " + name + "email is: " + email + "password is: " + password);
});


// post method for signin page
app.post("/signin", (req, res) => {
  var email = req.body.useremail;
  var password = req.body.userpassword;

  // getting only on server
  console.log(req.body);

  // getting on page also users data
  res.send("email is: " + email + "password is: " + password);
});

app.get("/covidlive", (req, res) => {
  const url = "https://api.covid19india.org/data.json";
  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      let data = [];
      for (let i = 0; i < body.statewise.length; i++) {
        data.push({
          "State": body.statewise[i].state,

          "Confirmed": body.statewise[i].confirmed,

          "Active": body.statewise[i].active,

          "Recovered": body.statewise[i].recovered,

          "Death": body.statewise[i].deaths
        });
      }

      console.log("-----Total Cases in India " +
        "and in each state-----");
      console.log(data);
      //Format to table
      console.table(data);
      res.render("covidLive", {
        state: body.statewise
      });
    }
  })

});

// using routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log(`Server has started successfully on port ${port}`);
});
