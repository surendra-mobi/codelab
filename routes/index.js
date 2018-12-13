var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home ', tab:req.originalUrl});
});
router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Services', tab:req.originalUrl });
});
router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Blog', tab:req.originalUrl });
});
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact', tab:req.originalUrl});
});
module.exports = router;
