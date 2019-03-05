var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var Category = require('../models/categories');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home ', tab:req.originalUrl});
});
router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Services', tab:req.originalUrl });
});
router.get('/blog', function(req, res, next) {
  var categories = Category.getCategories(function(err, categories){
  Post.getPosts(function(err,posts){
	   if(err) return console.log(err);
	   res.render('blog', { title: 'Blog', tab:req.originalUrl,posts:posts,categories:categories});	  
  },1000);
  
});});
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact', tab:req.originalUrl});
});
module.exports = router;
