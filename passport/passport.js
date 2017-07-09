var passport = require('passport');
var User = require('../modulesMongo/user');
var localStrategy = require('passport-local').Strategy;


/*configer passport*/
/*first configeration*/
/*serializeUser() tells the passport to store the user id in the session*/
passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(error, user){
		done(error, user);
	});
});


/******************************************************/
/*Create a new strategy for SIGN UP/ a new middleware*/
/****************************************************/

passport.use('local.signup', new localStrategy({
	
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
	
}, function(req, email, password, done){
	
	
	req.checkBody('name', 'Name is required in order to sign up').notEmpty(); 
	req.checkBody('name', 'Name must include only letters').isAlpha(); 
	req.checkBody('username', 'Username must include only letters').isAlpha();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('email', 'Invalid Email').isEmail(); /*isEmail is a validator*/
	req.checkBody('email', 'Email is required in order to sign up').notEmpty(); 
	req.checkBody('password', 'Invalid Password').notEmpty().isLength({min:4}); 
	req.checkBody('password2', 'Password does not match').notEmpty().isLength({min:4}); 
    req.assert('password2', 'Passwords do not match').equals(req.body.password);
	
	
	

/*
    req.check('username', 'This username is already taken').isUsernameAvailable();
*/
	
	
	var errors = req.validationErrors();
	
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	
	User.findOne({'email': email}, function(error, user){
		if(error){
			return done(error);
		}
		if(user){
			return done(null, false, {message: 'This E-mail is already taken'}); /*null means there are no errors..and false means that its not really successfull coz the email is taken! thats why i dont use true..but instead "false" but its an error again*/
		}
		/*so if we don't get an error and the user does not exist yet..then CREATE NEW USER by using mongoose model*/
		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		newUser.save(function(error, result){
			if(error){
				return done(error);
			}
			return done(null, newUser);
		});
	});
}));

/******************************************************/
/*Create a new strategy for SIGN IN/ a new middleware*/
/****************************************************/

passport.use('local.signin', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){
	req.checkBody('email', 'Invalid Email').notEmpty().isEmail(); /*isEmail is a validator*/
	req.checkBody('password', 'Invalid Password').notEmpty(); 
	var errors = req.validationErrors();
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	
	User.findOne({'email': email}, function(error, user){
		if(error){
			return done(error);
		}
		if( !user ){
			return done(null, false, {message: 'The user is not found'}); /*null means there are no errors..and false means that its not really successfull coz the email is taken! thats why i dont use true..but instead "false" but its an error again*/
		}
		if ( !user.validPassword(password) ){ /*validPassword() function..has been defined in user.js*/
			return done(null, false, {message: 'Wrong password'});
		}
		
		return done(null, user); /*the user here is the user i find in the database*/
	});
}));






