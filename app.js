var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session); /*this should always come after var session = require('express-session');*/

var routes = require('./routes/index');
var userRoutes = require('./routes/user');


var app = express();

// connect mongoose
mongoose.connect('localhost:27017/shop');
require('./passport/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());		 /*the validator will parse the body on its own..so it has to be after the bodyParser is done..otherwise it can't validate it*/
app.use(cookieParser());
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(function(req, res, next) {
   req.session.cookie.maxAge = 180 * 60 * 1000; // 3 hours
   next();
});
app.use(flash()); 					/*flash after the session cozit needs the session to be initialized first*/
app.use(passport.initialize());
app.use(passport.session());		 /*initialize passport to use session to store a user */
app.use(express.static(path.join(__dirname, 'public')));

/*BOOTSTRAP */
/*app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));*/

app.use(function(req, res, next){ 					  /*this middelware is going to be excuted in all requests*/
	res.locals.login = req.isAuthenticated();		 /*this is going to be in all my views and its going to be either TRUE or FALSE..login is global and it r													going to be used in the if statemnt n header.hbs*/
	res.locals.session = req.session;
	res.locals.user = req.user; 
	
	next();											/*to let the request continue*/
	
});

app.use('/user', userRoutes);
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
