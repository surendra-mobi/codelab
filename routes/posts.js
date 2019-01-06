var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images' })
var Post = require('../models/post');
var Category = require('../models/categories');

router.get('/show/:id', function(req, res, next) {
	Post.getPostById(req.params.id,function(err, post){
		res.render('show',{
  			'post': post
  		});
	});
});

router.get('/add', function(req, res, next) {
	var categories = Category.getCategories(function(err, categories){
		res.render('addpost',{
  			'title': 'Add Post',
  			'categories': categories
  		});
	},1000);

});

router.post('/add', upload.single('mainimage'), function(req, res, next) { 
  // Get Form Values
  var title = req.body.title;
  var category= req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();
  console.log(req.body);
  // Check Image Upload
  if(req.file){
  	var mainimage = req.file.filename
  } else {
  	var mainimage = 'noimage.jpg';
  }

  	// Form Validation
	req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('body', 'Body field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();

	if(errors){
		var categories = Category.getCategories(function(err, categories){
		res.render('addpost',{
  			'title': 'Add Post',
  			'categories': categories,
			"errors": errors
  		});
	},1000);
	} else {
		console.log(Post);
		Post.addPost({
			"title": title,
			"body": body,
			"category": category,
			"date": date,
			"author": author,
			"mainimage": mainimage
		}, function(err, post){
			if(err){
				res.send(err);
			} else {
				req.flash('success','Post Added');
				res.location('/');
				res.redirect('/');
			}
		});
	}
});


router.post('/addcomment', function(req, res, next) {
  // Get Form Values
  var name = req.body.name;
  var email= req.body.email;
  var body = req.body.body;
  var postid= req.body.postid;
  var commentdate = new Date();
				
  	// Form Validation
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('email','Email field is required but never displayed').notEmpty();
	req.checkBody('email','Email is not formatted properly').isEmail();
	req.checkBody('body', 'Body field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();
	if(errors){
		Post.getPostById(postid, function(err, post){ 		 console.log("stage2");

			res.render('show',{
				"errors": errors,
				"post": post
			});
		});
	} else { 
		var comment = {
			"name": name,
			"email": email,
			"body": body,
			"commentdate": commentdate
		}
		Post.findById(postid, function (err, post) {
			if (err) throw err;

			post.push({"comments":comment});
			console.log("hi",post);
return false;
			post.save(function (err, updatedpost) {
			if (err)  throw err;
			res.send(updatedpost);
			});
		});



		postModal.updateOne({
			"_id": postid
		},{
			$push:{
				"comments": comment
			}
		}, function(err, doc){
console.log("hi",doc);
return false;
			if(err){
				throw err;
			} else {

				req.flash('success', 'Comment Added');
				res.location('/posts/show/'+postid);
				res.redirect('/posts/show/'+postid);
			}
		});
	}
});

module.exports = router;