var express = require('express');
var router = express.Router();
var latest = require('../controllers/api');
var request = require('request');

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// /api/latest/:product/:os
router.get('/latest/:product/:os', function(req, res) {
  latest(req, function(url){
    console.log(url);
    request(url).pipe(res);
  })
});


// console.log(router.stack);
module.exports = router;
