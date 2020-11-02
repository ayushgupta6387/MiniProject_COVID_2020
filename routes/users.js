const express = require('express');
const router = express.Router();

router.get('/login', (req, res)=> res.render('signin'));
router.get('/register', (req, res)=> res.render('signup'));

// get data typed on register page
router.post('/register', (req, res) => {
     console.log(req.body);
      res.send("Hey Get it!") })

module.exports = router;