var express = require('express');
var router = express.Router();
var Cart = require('../modulesMongo/cart');

var Product = require('../modulesMongo/product');
var Order = require('../modulesMongo/order');


/* GET home page. */
router.get('/', function(req, res, next) {
	
  var successMsg = req.flash('success')[0];
	/*fetching products*/
  Product.find(function(error, docs){ // callback function to get the exact amount of products we have in index.hbs/productSeeder.js which are 8 items!
	  	var productChunks = [];
	  	var chunkSize = 4;
	  	
	  	for(var i=0; i < docs.length; i += chunkSize){
			productChunks.push(docs.slice(i, i + chunkSize));
		}
	   res.render('shop/index', { title: 'My Shopping Cart', products: productChunks, successMsg: successMsg, noMessage: !successMsg });/*keynames must match the variables in {{}} in index.hbs for example {{successMsg}}*/
  });
});

router.get('/add-to-cart/:id', function(req, res, next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	
	Product.findById(productId, function(error, product){
		if(error){
			return res.redirect('/');
		}
			cart.add(product, product.id);
			req.session.cart = cart;
			console.log(req.session.cart);
			res.redirect('/');
	});
});

router.get('/add/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.AddByOne(productId);
    req.session.cart = cart;
    res.redirect('/shoppingCart');
});

router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shoppingCart');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shoppingCart');
});

router.get('/shoppingCart', function(req, res, next){
	if(!req.session.cart){
		return res.render('shop/shoppingCart', {products: null});
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/shoppingCart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});


router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingCart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shoppingCart');
    }
    var cart = new Cart(req.session.cart);
    
    var stripe = require("stripe")(
        "sk_test_sgw6vLhWJGIBooekvqOCXjiu"
    );
	    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // stripToken is taken from the name in $form.append($('<input type="hidden" name="stripeToken" />').val(token)); from checkout.js

        description: "Test Charge"
			
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user, /*user is stored in req because of passport so whenever i sign in with passport, passport will place this user on the req*/
            cart: cart, /* cart: cart..i'll take it from cart here in this file-> var cart = new Cart(req.session.cart); since its already extracting here*/
            address: req.body.address, /*retrieve it from the post req ..so req.body.adress-> adress stands for the name="address" in checkout.hbs*/
            name: req.body.name, /*same goes for req.body.name -> name is for name="name"*/
            paymentId: charge.id /*retrieve it from the charge object in this function (err, charge){ which gets called in the callback! look at the stripe documentation and you'll know that the charge stores the payment id*/
        });
        order.save(function(err, result) { /*save the order to the database*/
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null; /*clearing the cart after successeding buying the product*/
            res.redirect('/'); 
        });
    }); 
});


module.exports = router;



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url; /*with this i'm storing the old url and will use it again when signed in*/
    res.redirect('/user/signin');
}









