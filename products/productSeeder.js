var Product = require('../modulesMongo/product');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shop');

var products = [
	
	new Product({
		imagePath: 'http://www.freeiconspng.com/uploads/blank-t-shirt-png-9.png',
		title: 'Vibrant V-NECK',
		description: 'awesomeeeeeeee',
		price: 10
	}),
	new Product({
		imagePath: 'http://www.freeiconspng.com/uploads/blank-t-shirt-png-9.png',
		title: 'Outline Tank',
		description: 'awesomeeeeeeee',
		price: 12
	}),
	new Product({
		imagePath: 'http://www.freeiconspng.com/uploads/blank-t-shirt-png-9.png',
		title: 'Sando Shirt',
		description: 'awesomeeeeeeee',
		price: 10
	}),
	new Product({
		imagePath: 'http://www.freeiconspng.com/uploads/blank-t-shirt-png-9.png',
		title: 'Flowery Blouse',
		description: 'awesomeeeeeeee',
		price: 15
	}),
	new Product({
		imagePath: 'http://www.freeiconspng.com/uploads/blank-t-shirt-png-9.png',
		title: 'Tank Top',
		description: 'awesomeeeeeeee',
		price: 25
	}),
	new Product({
		imagePath: 'http://www.freeiconspng.com/uploads/blank-t-shirt-png-9.png',
		title: 'Surplice',
		description: 'awesomeeeeeeee',
		price: 10
	}),
	new Product({
		imagePath: 'http://www.freeiconspng.com/uploads/blank-t-shirt-png-9.png',
		title: 'Hoodie',
		description: 'awe',
		price: 30
	}),
	new Product({
		imagePath: 'http://www.freeiconspng.com/uploads/blank-t-shirt-png-9.png',
		title: 'Camisole',
		description: 'awesomeeeeeeee',
		price: 20
	})
];

var finish = 0;

for(var i=0; i<products.length; i++){
	products[i].save(function(error, result){
		finish++;
		if(finish === products.length){
			exit();
		}
	});
}

function exit(){
	mongoose.disconnect();
}

	