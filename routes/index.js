var express = require('express');
var router = express.Router();

/* GET home */
router.get('/', function(req, res, next) {
  res.redirect("/archive")
});

router.get('/archive', function(req, res, next) {
  res.render('index', { title: 'archive', url: process.env.URL });
});

// console.log(router.stack);
module.exports = router;
