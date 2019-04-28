var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var hbs = require('hbs');
var expressValidator = require('express-validator');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var session = require('express-session');

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var categoriesRouter = require('./routes/categories');
var techbooksAdminRouter = require('./controllers/manage');
var postAdminRouter = require('./controllers/posts');

var techbooksRouter = require('./controllers/books');
var techbooksCartRouter = require('./controllers/cart');
var moment = require('moment');
var userRouter = require('./controllers/user');

var passport = require('passport');
require('./config/passport')(passport); // pass passport for configuration
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Connect-Flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
  app.use(function(req, res, next){
    var cart = req.session.cart;
		var displayCart = {items: [], total:0, qty:0};
		var total = 0;

		// Get Total
		for(var item in cart){
			displayCart.items.push(cart[item]);
			displayCart.qty +=cart[item].qty;
			total += (cart[item].qty * cart[item].price);
		}
		displayCart.total = total;
       app.locals.cart=displayCart;
	   	if (req.isAuthenticated()){
			app.locals.username=req.user.name;
		}else{
			app.locals.username=false;
		}
        next();
  });
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/posts', postsRouter);
app.use('/categories', categoriesRouter);
app.use('/techbooks/admin', techbooksAdminRouter);
app.use('/techbooks', techbooksRouter);
app.use('/techbooks/cart', techbooksCartRouter);
app.use('/admin/post', postAdminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
