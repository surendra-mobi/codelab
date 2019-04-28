	var express = require('express');
	var router = express.Router();
	var passport = require('passport');
	router.get('/', function(req, res) {
		res.render('login/index');
	});
	router.get('/profile', isLoggedIn, function(req, res) {
		var usrObj= JSON.stringify(req.user);
		res.render('login/profile', {
			user : usrObj
		},  );
	});
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	router.get('/login', function(req, res) {
		res.render('login/login', { message: req.flash('loginMessage'),layout:"login/layout"  });
	});
	router.post('/login', passport.authenticate('local-login', {
		successRedirect : '/user/profile',
		failureRedirect : '/login',
		failureFlash : true 
	}));

	router.get('/signup', function(req, res) {
		res.render('login/signup', { message: req.flash('loginMessage'), layout:"login/layout"  });
	});

	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/user/profile', 
		failureRedirect : '/signup', 
		failureFlash : true 
	}));
	router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	router.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/user/profile',
			failureRedirect : '/'
		}));

	router.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

	router.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/user/profile',
			failureRedirect : '/'
		}));

	router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

	router.get('/auth/google/callback',
	
	 function(req, res, next) {
		 if(req.query.destination){
			 redirectUrl=req.query.destination;
			 
		 }else{
			 redirectUrl="/user/profile";
		 }
		passport.authenticate('google', {
			successRedirect : redirectUrl,
			failureRedirect : '/'
		})(req, res, next);});

	router.get('/connect/local', function(req, res) {
		res.render('connect-local.ejs', { message: req.flash('loginMessage') });
	});
	router.post('connect/local', passport.authenticate('local-signup', {
		successRedirect : '/user/profile', // redirect to the secure profile section
		failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	router.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

	router.get('/connect/facebook/callback',
		passport.authorize('facebook', {
			successRedirect : '/user/profile',
			failureRedirect : '/'
		}));

	router.get('//connect/twitter', passport.authorize('twitter', { scope : 'email' }));

	router.get('//connect/twitter/callback',
		passport.authorize('twitter', {
			successRedirect : '/user/profile',
			failureRedirect : '/'
		}));



	router.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

	router.get('/connect/google/callback',
		passport.authorize('google', {
			successRedirect : '/user/profile',
			failureRedirect : '/'
		}));


	module.exports = router;
	function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
	}
