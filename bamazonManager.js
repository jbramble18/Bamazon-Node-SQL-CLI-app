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
	startInquirer();
});

function startInquirer() {
	inquirer
		.prompt([{
			type: 'list',
			message: 'What would you like to do?',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add items to Inventory', 'Add new products'],
			name: 'manager'
		}])
		.then(function (res) {
			switch (res.manager) {
				case "View Products for Sale":
					viewProducts();
					break;

				case "View Low Inventory":
					viewLowInventory();
					break;

				case "Add items to Inventory":
					addInventory();
					break;

				case "Add new products":
					addProducts();
					break;
			}

		})
};

function viewProducts() {

	var query = 'SELECT * FROM products';

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
		connection.close;
		repeat();
	})
	
};

function viewLowInventory() {
	var query = "SELECT * FROM products WHERE stock_quantity <=5";

	connection.query(query, function (err, results) {
		if (err) throw err;
		for (var i = 0; i < results.length; i++) {
			console.log('\n Inventory that is running low: \n');
			console.log('----------------------------------------------------------------------\n');

			var products = '';
			products = '';
			products += 'Item ID: ' + results[i].product_id + '  //  ';
			products += 'Product Name: ' + results[i].product_name + '  //  ';
			products += 'Department: ' + results[i].department_name + '  //  ';
			products += 'Quanitity Available for Purchase: ' + results[i].stock_quantity + '\n';

			console.log(products);
		}

		console.log("---------------------------------------------------------------------\n");
		repeat();

	})



};


function addInventory() {

	inquirer
	.prompt([
	  {
		message: "Enter item id to be updated: ",
		type: "input",
		name: "product_id",
		
	  },
	  {
		message: "Enter amount to adjust inventory: ",
		type: "input",
		name: "amount",
	  }

	]).then(function(input) {
			var item = input.product_id;
			var addQuantity = input.amount;

			var query = 'SELECT * FROM products WHERE ?';

			connection.query(query, {product_id: item}, function(err, results) {
				if (err) throw err;

				if (results.length === 0) {
					console.log('Please enter a valid item id...');
					addInventory();

				} else {
					var new_amount = results[0];
					console.log('Updating Inventory...');

					var updatedQuery = 'UPDATE products SET stock_quantity = ' + (parseInt(new_amount.stock_quantity) + parseInt(addQuantity)) + ' WHERE product_id = ' + item;

					connection.query(updatedQuery, function(err, results) {
						if (err) throw err;
						console.log("Inventory has been updated!")

						startInquirer();
					})
			  }
	})
})
}

function addProducts() {

	inquirer.prompt([
		{
			name: "item",
			type: "input",
			message: "Enter the name of the product to add to the inventory.",
		},
		{
			name: "department",
			type: "input",
			choices: "department",
			message: "Enter a department for the new product."
		},
		{
			name: "quantity",
			type: "input",
			message: "Enter the quantity of products that will be in stock."
		},
		{
			name: "price",
			type: "input",
			message: "What is the price for the new product?"
		}

	]).then(function(input) {
		var query  = connection.query(
			"INSERT INTO products SET ?",
		
		{
			product_name: input.item,
			department_name: input.department,
			price: input.price,
			stock_quantity: input.quantity
		},
		function (err, res) {
			if (err) throw err;
			console.log("New product added!");
			// connection.end;
			repeat();
		})
	})
};

function repeat () {
	inquirer.prompt({
		name: "manage",
		type: "list",
		choices: ["Yes", "No"],
		message: "Would you like to continue managing bamazon?"

	}).then(function (res) {
		if (res.manage == "Yes") {
			startInquirer();
		}

		else {
			console.log("Have a great day!")
			connection.end();
		}
	});
}