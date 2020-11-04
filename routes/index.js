const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

// open home by defaults
router.get('/', (req, res)=> res.render('home'));
router.get('/dashboard', ensureAuthenticated, (req, res)=> 
res.render('dashboard', {
    name: req.user.name
}));

module.exports = router;