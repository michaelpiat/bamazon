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
	start();
});

function start() {
	connection.query("SELECT * FROM products", function(err, res){
		for (var i=0; i < res.length; i++) {
			
			console.log("Items avilable for sale: "+"\n"+"Item ID: "+res[i].item_id+"\n"+"Product: "+res[i].product_name
				+"\n"+"Department: "+res[i].department_name+"\n"+"Price: $"+res[i].price+"\n"+"Quantity avilable: "+res[i].stock_quantity);
			console.log("---------------");
		}

		inquirer.prompt([
			{
				name: "productId",
				type: "input",
				message: "Please enter the ID number of the product you wish to purchase: ",
				validate: function(value) {
          			if (isNaN(value) === false) {
            			return true;
          			}
          				return false;
        		}
			},
			{
				name: "amount",
				type: "input",
				message: "Please enter the amount of units you wish to purchase: ",
				validate: function(value) {
          			if (isNaN(value) === false && value > 0) {
            			return true;
          			}
          				return false;
        		}
			}
		]).then(function(answer){

			var userItem = res[answer.productId];			
			
			if(userItem.stock_quantity < answer.amount){
				console.log("Insufficient quantity!");
				start();
			}
			else {
				
				var updatedQty = parseInt(userItem.stock_quantity - answer.amount);
				var purchaseTotal = parseFloat(userItem.price * answer.amount)
				connection.query(
					"UPDATE products SET ? WHERE ?",
					[
						{
							stock_quantity: updatedQty
						},
						{
							item_id: answer.productId
						}
					],
					console.log("Your total is: $"+purchaseTotal+"\n"+"Thank you for shopping with us, please visit again soon!")
				)
				inquirer.prompt([
						{
							name:"buyMore",
							type:"confirm",
							message:"Would you like to purchase something else?"
						}

					]).then(function(answer){
						if(answer.buyMore === true) {
							start();
						}
						else {
							process.exit();
						}
					})
			}

		});
	});
}
