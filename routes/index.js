const express = require('express');
const router = express.Router();

// open home by defaults
router.get('/', (req, res)=> res.render('home'));

module.exports = router;