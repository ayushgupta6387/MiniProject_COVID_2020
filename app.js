const express = require("express");
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

app.get("/covidLive", (req, res) => {
  res.render("covidLive");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
