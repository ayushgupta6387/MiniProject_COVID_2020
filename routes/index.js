const express = require("express");
const request = require("request");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

// open home by defaults
router.get("/", (req, res) => {

const url = "https://api.covid19api.com/summary";
request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
        body = JSON.parse(body);

        res.render("home", {
          allData: body.Global,
        })
    }
    })
});



router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashbord", {
    name: req.user.name,
  })
);

module.exports = router;
