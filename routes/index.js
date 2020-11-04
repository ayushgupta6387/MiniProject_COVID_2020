const express = require('express');
const router = express.Router();

// open home by defaults
router.get('/', (req, res)=> res.render('home'));
router.get('/dashboard', (req, res)=> res.render('dashboard'));

module.exports = router;