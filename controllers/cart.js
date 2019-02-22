'use strict';
var express = require('express');

var Book = require('../models/books/bookModel');
var Category = require('../models/books/categoryModel');
var User = require('../models/user.js');

var router = express.Router();

	router.get('/', function(req, res){
		
		// Render Cart
		res.render('cart/index', {
		});
	});

	router.get('/add/:id', function(req, res){
		req.session.cart = req.session.cart || {};
		var cart = req.session.cart;
		Book.findOne({_id:req.params.id}, function(err, book){
			if(err){
				console.log(err);
			}

			if(cart[req.params.id]){
				cart[req.params.id].qty++
				cart[req.params.id]['subtotal']=cart[req.params.id]['subtotal']+book.price;
			} else {
				cart[req.params.id] = {
					item: book._id,
					title: book.title,
					price: book.price,
					subtotal:book.price,
					qty: 1
				}
			}

			res.redirect('/techbooks/cart');
		});
	});
module.exports=router;