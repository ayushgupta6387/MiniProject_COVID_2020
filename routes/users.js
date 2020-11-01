const express = require('express');
const router = express.Router();

router.get('/login', (req, res)=> res.render('signin'));
router.get('/register', (req, res)=> res.render('signup'));

module.exports = router;