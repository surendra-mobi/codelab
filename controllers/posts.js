var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images' })
var Post = require('../models/post');
var Category = require('../models/categories');
var fs = require('fs');
var path = require('path')
router.get('/show/:id', function(req, res, next) {
	Post.getPostById(req.params.id,function(err, post){
		res.render('show',{
  			'post': post
  		});
	});
});

router.get('/', function(req, res, next) {
	Post.getPosts(function(err, posts){
		res.render('admin/posts/postlist',{
			'posts': posts,
			layout: 'admin/layout'
		});
	},1000);
});

router.get('/add', function(req, res, next) {
	var categories = Category.getCategories(function(err, categories){
		res.render('admin/posts/addpost',{
  			'title': 'Add Post',
  			'categories': categories
  		});
	},1000);

});
router.get('/edit/:id',function(req, res, next){
	var categories = Category.getCategories(function(err, categories){
	Post.getPostById(req.params.id,function(err, post){
		res.render('admin/posts/editpost',{
  			'post': post,
			'categories': categories
  		});
	});},1000);
});
router.get('/delete/:id',function(req, res, next){
	Post.deletePost(req.params.id,function(err){
		if(err) console.log(err);
		res.location('/posts');
		res.redirect('/posts');
	});
});
router.post('/add', upload.single('mainimage'), function(req, res, next) { 
  // Get Form Values
  var title = req.body.title;
  var category= req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();
  // Check Image Upload
  if(req.file){
	  console.log(req.file);
  	var mainimage = title+'-' + Date.now()+path.extname(req.file.originalname);
	fs.rename('./public/images/'+req.file.filename, './public/images/'+mainimage, function (err) {
		if (err) console.log(err);
			fs.stat('./public/images/'+mainimage, function (err, stats) {
			if (err) console.log(err);
		});
	});
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
		res.render('admin/posts/addpost',{
  			'title': 'Add Post',
  			'categories': categories,
			"errors": errors
  		});
	},1000);
	} else {
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
router.post('/edit', upload.single('mainimage'), function(req, res, next) { 
  var title = req.body.title;
  var category= req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();
  var id = req.body.id;
  if(req.file){
  	var mainimage = title+'-' + Date.now()+path.extname(req.file.originalname);
	fs.rename('./public/images/'+req.file.filename, './public/images/'+mainimage, function (err) {
		    if (err) return console.log(err);
			fs.stat('./public/images/'+mainimage, function (err, stats) {
				if (err) return console.log(err);
		    });
	});
  }else{
	  var mainimage= req.body.mainimage_old;
  }	  

	req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('body', 'Body field is required').notEmpty();

	// Check Errors
	var errors = req.validationErrors();

	if(errors){
		var categories = Category.getCategories(function(err, categories){
		if (err) return console.log(err);
		Post.getPostById(req.body.id,function(err, post){
	    if (err) return console.log(err);

		res.render('admin/posts/editpost',{
		'post': post,
		'categories': categories,
		"errors": errors
		});
		});},1000);
	} else {
		Post.findOneAndUpdate({_id:id},{
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
				req.flash('success','Post Updated');
				res.location('/admin/post');
				res.redirect('/admin/post');
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