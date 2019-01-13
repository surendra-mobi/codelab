'use strict';
var express = require('express');

var Book = require('../models/books/bookModel');
var Category = require('../models/books/categoryModel');
var User = require('../models/user.js');

var router = express.Router();

	router.get('/', function(req, res){
		 Book.find({},function(err,books){
			 if(err){
				 return console.log(err);
			 }
			 res.render('books/index',{books:books});
		 });
		
	});

	router.get('/details/:id', function(req, res){
		Book.findOne({_id: req.params.id}, function(err, book){
			if(err){
				console.log(err);
			}

			var model = {
        		book: book
        	};

        	res.render('books/details', model);
		});

	});
module.exports=router;