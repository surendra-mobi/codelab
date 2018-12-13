var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var Post = require('../models/post');
var Category = require('../models/categories');
router.get('/show/:category', function(req, res, next) {
	var posts = Post.getPosts(function(err, posts){
		res.render('index',{
  			'title': req.params.category,
  			'posts': posts
  		});
	},1000);

	/*posts.find({category: req.params.category},{},function(err, posts){
		res.render('index',{
  			'title': req.params.category,
  			'posts': posts
  		});
	}); */
});

router.get('/add', function(req, res, next) {
	res.render('addcategory',{
  		'title': 'Add Category'	
	});
});

router.post('/add', function(req, res, next) {
  var name = req.body.name;
	req.checkBody('name','Name field is required').notEmpty();
	var errors = req.validationErrors();

	if(errors){
		res.render('addpost',{
			"errors": errors
		});
	} else {
		var categories = db.get('categories');
		categories.insert({
			"name": name,
		}, function(err, post){
			if(err){
				res.send(err);
			} else {
				req.flash('success','Category Added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});

module.exports = router;