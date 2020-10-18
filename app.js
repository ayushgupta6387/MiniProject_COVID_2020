const express = require("express");

const request = require("request");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});


app.get("/sign", (req, res) => {
  res.render("signin");
});

app.get("/register", (req, res) => {
  res.render("signup");
});

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
        if (!error && response.statusCode == 200) {

            // The response data will be in string
            // Convert it to Object.
            body = JSON.parse(body);
            // The data have lot of extra properties
            // We will filter it
            var data = [];
            for (let i = 0; i < body.statewise.length; i++) {
                data.push({
                    "State": body.statewise[i].state,

                    "Confirmed": body.statewise[i].confirmed,

                    "Active": body.statewise[i].active,

                    "Recovered": body.statewise[i].recovered,

                    "Death": body.statewise[i].deaths
                });
            }

            console.log("-----Total Cases in India "
                + "and in each state-----");

            // Format to table
            console.table(data);
        }
    })
  res.render("covidLive");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
