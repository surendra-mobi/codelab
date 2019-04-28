var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var Category = require('../models/categories');
var moment = require('moment');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home ', tab:req.originalUrl});
});
router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Services', tab:req.originalUrl });
});
router.get('/blog', function(req, res, next) {
  var perPage = 2;
  var page = req.query.page || 1;
  var search = req.query.search || "";
  var category = req.query.category || "";
  var searchobj={};
  var categoryobj={};
  if(search){
    searchobj= {$or: [{"title": new RegExp(search, "i")}, {"body": new RegExp(search, "i")}]};
	if(category){
		searchobj= {"category":category,$or: [{"title": new RegExp(search, "i")}, {"body": new RegExp(search, "i")}]};
	}
  }else if(category){
		searchobj= {"category":category};
	} 
  
  if(category){
    categoryobj= {$or: [{"title": new RegExp(category, "i")}, {"body": new RegExp(category, "i")}]};
  }
  
  var categories = Category.find({}).exec(function(err, categories){
  if(err) return console.log(err);
  Post.find(searchobj)
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, posts) {
			if(err) return console.log(err);
            Post.count(searchobj).exec(function(err, count) {
                if (err) return next(err)
                res.render('blog', {
                    posts: posts,
					categories:categories,
                    current: page,
                    pages: Math.ceil(count / perPage),
					title: 'Blog', tab:req.originalUrl,
					moment:moment,
					search:search,
					category:category
                })
            })
        });
  /*Post.getPosts(function(err,posts){
	   if(err) return console.log(err);
	   res.render('blog', { title: 'Blog', tab:req.originalUrl,posts:posts,categories:categories});	  
  },1000);*/
  
});});
router.get('/blog/show/:id', function(req, res, next) {
  var id=req.params.id;
  id=id.split("-");
  id=id[id.length-1];
  var categories = Category.getCategories(function(err, categories){
  if(err) return console.log(err);
  Post.getPostById(id,function(err,posts){
	   if(err) return console.log(err);
	   res.render('blogdetail', { title: 'Blog', tab:req.originalUrl,post:posts,categories:categories,moment:moment, url:req.url});	  
  
  });
  
});});
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact', tab:req.originalUrl});
});
module.exports = router;
