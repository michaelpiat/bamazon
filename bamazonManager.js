var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port:3306,
	user:"root",
	database:"bamazon_db"
});
connection.connect(function(err){
	if (err) throw err; 

	console.log("connected as id " + connection.threadId);
	manager();
});

function manager(){
	inquirer.prompt({
		name:"managerOption",
		type:"rawlist",
		message:"Please select an option below:",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]

	}).then(function(answer){
			switch (answer.managerOption) {
    			case "View Products for Sale":
      				forSale();
      				break;
				case "View Low Inventory":
      				inventory();
      				break;
    			case "Add to Inventory":
      				addInventory();
      				break;
      			case "Add New Product":
      				addProduct();
      				break;  				
  			}
		})
}

function forSale(){
	connection.query("SELECT * FROM products", function(err, res){
		for (var i=0; i < res.length; i++) {
			
			console.log("Items avilable for sale: "+"\n"+"Item ID: "+res[i].item_id+"\n"+"Product: "+res[i].product_name
				+"\n"+"Department: "+res[i].department_name+"\n"+"Price: $"+res[i].price+"\n"+"Quantity avilable: "+res[i].stock_quantity);
			console.log("---------------");
		}
		process.exit();
	});		
}

function inventory(){
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){

		if(res.length === 0){
			console.log("No low inventory");
			process.exit();
		}
		else {
			for (var i=0; i < res.length; i++) {
			
					console.log("Low inventory items: "+"\n"+"Item ID: "+res[i].item_id+"\n"+"Product: "+res[i].product_name
						+"\n"+"Department: "+res[i].department_name+"\n"+"Price: $"+res[i].price+"\n"+"Quantity avilable: "+res[i].stock_quantity);
					console.log("---------------");
			}
		}
		process.exit();	
	})
}

function addInventory(){
	
		inquirer.prompt([
			{
				name:"inventoryId",
				type:"input",
				message:"Please select an item by ID to add inventory: ",
				validate: function(value) {
          			if (isNaN(value) === false) {
            			return true;
          			}
          				return false;
        		}
			},
			{
				name:"addUnits",
				type:"input",
				message:"How many units would you like to add?",
				validate: function(value) {
          			if (isNaN(value) === false) {
            			return true;
          			}
          				return false;
        		}
			}
	
		]).then(function(answer){
			var query1 = "SELECT item_id, stock_quantity FROM products WHERE item_id = ?";		
			connection.query(query1,[answer.inventoryId], function(err, res){
				
				if(res.length > 0) {

					var currentStock = res[0].stock_quantity;
					
					var query2 = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
					connection.query(query2,[currentStock + parseInt(answer.addUnits), answer.inventoryId], function(err, res){
						if (err) throw err;

						console.log("Inventory added!");
						process.exit();
					})
				}
			})
		
		});
		
}

function addProduct() {

	inquirer.prompt([
		{
			name:"product",
			type:"text",
			message:"What is the name of the product?"
		},
		{
			name:"department",
			type:"text",
			message:"What department?"
		},
		{
			name:"price",
			type:"text",
			message:"What is the price?",
			validate: function(value){
				return (!isNaN(value) && parseFloat(value) > 0)
			}
		},
		{
			name:"stock",
			type:"text",
			message:"How much is in stock?",
			validate: function(value){
				return (!isNaN(value) && parseInt(value) > 0)
			}
		}
	]).then(function(answer){
		connection.query(
			"INSERT INTO products SET ?",
			{
				product_name: answer.product,
				department_name: answer.department,
				price: parseFloat(answer.price),
				stock_quantity: parseInt(answer.stock)
			},
			function(err, res) {
				if (err) throw err;
				console.log("New product added");
				process.exit();
			}
		);
	})
}
