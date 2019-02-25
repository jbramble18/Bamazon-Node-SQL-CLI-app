var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",

	password: "Samuel#123",
	database: "bamazon_db"
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	displayInventory();
});

//function to display the inventory from the mySQL database


function displayInventory() {

	var query = 'SELECT * FROM products';

	// Make the db query
	connection.query(query, function (err, results) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('----------------------------------------------------------------------\n');

		var products = '';
		for (var i = 0; i < results.length; i++) {
		 products = '';
		 products += 'Item ID: ' + results[i].product_id + '  //  ';
		 products += 'Product Name: ' + results[i].product_name + '  //  ';
		 products += 'Department: ' + results[i].department_name + '  //  ';
		 products += 'Price: $' + results[i].price + '\n';
		 products += 'Quanitity Available for Purchase: ' + results[i].stock_quantity + '\n';

			console.log(products);
		}

		console.log("---------------------------------------------------------------------\n");

		purchaseItem();
	})
};

//function to prompt the user to select the items listed

function purchaseItem() {

	inquirer.prompt([{

			type: 'input',
			name: 'product_id',
			message: 'Please enter the Item ID which you would like to purchase.',

		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to purchase?',
		}
	]).then(function (input) {

		var item = input.product_id;
		var quantity = input.quantity;

		var query = 'SELECT * FROM products WHERE ?';

		connection.query(query, {
			product_id: item
		}, function (err, results) {
			if (err) throw err;

			else if (results.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				displayInventory();

			} else {
				var productresults = results[0];


				// If the quantity requested by the user is in stock
				if (quantity <= productresults.stock_quantity) {
					console.log('Congratulations, the product you requested is in stock! Placing order!');

					var updateQueryString = 'UPDATE products SET stock_quantity = ' + (productresults.stock_quantity - quantity) + ' WHERE product_id = ' + item;

					// Update the inventory
					connection.query(updateQueryString, function (err, results) {
						if (err) throw err;

						console.log('Your oder has been placed! Your total is $' + productresults.price * quantity);
						console.log('Thank you for shopping with us!');
						console.log("\n---------------------------------------------------------------------\n");

						reprompt();

					})
				} else {
					console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");

					reprompt();

				}
			}
		})
	})
};

function reprompt() {
	inquirer.prompt([{
		type: "confirm",
		name: "confirm",
		message: "Would you like to purchase another item?",
		default: true
	}]).then(function (inquirerResponse) {
		if (inquirerResponse.confirm) {
			displayInventory();
		} else {
			console.log("Thanks again for your order, hope to see you again soon!");
			connection.end();
		}
	});
};

