var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Order = require('../modulesMongo/order');
var Cart = require('../modulesMongo/cart');



var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart); /*generate a new cart for every new order*/
            order.items = cart.generateArray();
        });
        res.render('user/profile', { orders: orders }); /*pass "orders" to the view*/
    });
});


router.get('/logout', isLoggedIn, function(req, res, next){
	req.logout();
	res.redirect('/');
});


router.use('/', notLoggedIn, function(req, res, next){
	next();
});

router.get('/signup', function(req, res, next){
	/*so the validation errors would work*/
	var messages = req.flash('error'); /*the message in passport.js is stored under error..so we wanna flash it by outputting a req. In case the email is already taken, let the message pop up..and input it in signup.hbs*/
	res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0}); /*> 0 ..coz otherwise we have no messages so we have no errors*/
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.get('/signin', function(req, res, next){
	var messages = req.flash('error'); /*the message in passport.js is stored under error..so we wanna flash it by outputting a req. In case the email is already taken, let the message pop up..and input it in signup.hbs*/
	res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});


router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null; /*clear the old url*/
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

module.exports = router;


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

function notLoggedIn(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}












