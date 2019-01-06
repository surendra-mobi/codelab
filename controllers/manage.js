var express = require('express');

var Book = require('../models/books/bookModel');
var Category = require('../models/books/categoryModel');
var router = express.Router();


    router.get('/', function (req, res) {   
        res.render('admin/index',{layout: 'admin/layout'});             
    });

    // get Books
    router.get('/books', function (req, res) {   
        Book.find({}, function(err, books){
         	if(err){
         		console.log(err);
         	}

         	/*var model = {
         		books: books,
				layout: 'admin/layout'
         	}*/

         	res.render('admin/books/index', {books: books,layout: 'admin/layout'});
         });             
    });

    //Add Book Form
    router.get('/books/add', function(req, res){
    	Category.find({}, function(err, categories){
    		if(err){
         		console.log(err);
         	}

         	

         	res.render('admin/books/add', {layout: 'admin/layout', categories: categories});
    	});
    });

    // Add Book
    router.post('/books', function(req, res){
    	var title = req.body.title && req.body.title.trim();
        var category = req.body.category && req.body.category.trim();
        var author = req.body.author && req.body.author.trim();
        var publisher = req.body.publisher && req.body.publisher.trim();
        var price = req.body.price && req.body.price.trim();
        var description= req.body.description && req.body.description.trim();
        var title = req.body.title && req.body.title.trim();
        var cover = req.body.cover && req.body.cover.trim();

        if (title == '' || price == '') {
            req.flash('error', "Please fill out required fields");
            res.location('/techbooks/admin/books/add');
            res.redirect('/techbooks/admin/books/add');
        }

        if(isNaN(price)){
            req.flash('error', "Price must be a number");
            res.location('/techbooks/admin/books/add');
            res.redirect('/techbooks/admin/books/add');
        }

        var newBook = new Book({
            title: title,
            category: category,
            description: description,
            author: author,
            publisher: publisher,
            cover: cover,
            price: price
        });

        newBook.save(function(err){
            if(err) {
                console.log('save error', err);
            }

            req.flash('success', "Book Added");
            res.location('/techbooks/admin/books');
            res.redirect('/techbooks/admin/books');
        });
    });

    // Edit Book
    router.get('/books/edit/:id', function (req, res) {
         Category.find({},function (err, categories) {
             Book.findOne({_id:req.params.id},function (err, book) {
                if (err) {
                    console.log(err);
                }
				console.log(book);
                var model ={
                    book: book,
                    categories: categories,
					layout: 'admin/layout'
                };
                res.render('admin/books/edit', model);
            });
        });
    });

    // Update Book
    router.post('/books/edit/:id', function(req, res){
        var title = req.body.title && req.body.title.trim();
        var category = req.body.category && req.body.category.trim();
        var author = req.body.author && req.body.author.trim();
        var publisher = req.body.publisher && req.body.publisher.trim();
        var price = req.body.price && req.body.price.trim();
        var description= req.body.description && req.body.description.trim();
        var cover = req.body.cover && req.body.cover.trim();


        Book.update({_id: req.params.id}, {
            title:title,
            category: category,
            author: author,
            publisher: publisher,
            price: price,
            description: description,
            cover: cover

        }, function(err) {
            if(err) {
                console.log('update error', err);
            }

            req.flash('success', "Book Updated");
            res.location('/manage/books');
            res.redirect('/manage/books');
        });

    });

    // Delete book
    router.post('/books/delete/:id', function (req, res) {
        Book.remove({_id: req.params.id}, function (err) {
            if (err) {
                console.log(err);
            }
            req.flash('success', "Book Deleted");
            res.location('/manage/books');
            res.redirect('/manage/books');
        });
    });


    // Get Categories
    router.get('/categories', function (req, res) {   
        Category.find({}, function(err, categories){
            if(err){
                console.log(err);
            }

          

            res.render('admin/categories/index', {categories: categories, layout: 'admin/layout'}); 
        })              
    });

    // Display category add form
    router.get('/categories/add', function (req, res) {
        res.render('admin/categories/add',{layout: 'admin/layout'});
    });


    // Add a new category
    router.post('/categories', function(req, res){          

        var name= req.body.name && req.body.name.trim();
        if (name == '') {
            req.flash('error', "Please fill out required fields");
            res.location('/manage/categories/add');
            res.redirect('/manage/categories/add');
        }

        var newCategory = new Category({
            name:name
        });

        newCategory.save(function(err) {
            if(err) {
                console.log('save error', err);
            }

            req.flash('success', "Category Added");
            res.location('/techbooks/admin/categories');
            res.redirect('/techbooks/admin/categories');
        });

    });


     // Display category edit form
    router.get('/categories/edit/:id', function (req, res) {
         Category.findOne({_id:req.params.id},function (err, category) {
            if (err) {
                console.log(err);
            }
           
            res.render('admin/categories/edit', {category: category, layout: 'admin/layout'});
        });
    });

    // Edit category
    router.post('/categories/edit/:id', function(req, res){
        var name= req.body.name && req.body.name.trim();

        Category.update({_id: req.params.id}, {
            name:name
        }, function(err) {
            if(err) {
                console.log('update error', err);
            }

            req.flash('success', "Category Updated");
            res.location('/techbooks/admin/categories');
            res.redirect('/techbooks/admin/categories');
        });

    });

    // Delete category
    router.post('/categories/delete/:id', function (req, res) {
        Category.remove({_id: req.params.id}, function (err) {
            if (err) {
                console.log(err);
            }
            req.flash('success', "Category Deleted");
            res.location('/manage/categories');
            res.redirect('/manage/categories');
        });
    });

module.exports = router;
module.exports = router;