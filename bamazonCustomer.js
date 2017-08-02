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
	})
}