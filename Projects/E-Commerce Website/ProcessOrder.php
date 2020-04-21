<?php // <--- do NOT put anything before this PHP tag

/*

 - This file deals with what happens after the user clicks the 'Confirm Order' button.
   The system needs to perform a number of steps:
    1) check they have items in their cart (cookie)
    2) check the username they entered is valid, we can do this by trying to find them in the customers table
	3) add a new order to the Orders table.
	4) add each product in the shopping cart to the OrderProducts table.
	5) redirect them to the orderDetails page.
	
	If the username is not valid, instead of just displaying the message on the page, set a special message cookie.
	then redirect them back to ViewCart.php and we will handle the message cookie there.
	
	This file has three separate SQL statements, don't let that confuse you.

*/

include('functions.php');


// did the user provide a UserName via POST?
if(isset($_POST['UserName']) && isset($_POST['UserPassword']))
{
	$UserName = trim($_POST['UserName']);
	$UserPassword = trim($_POST['UserPassword']);
	
	// do they have items in their cart?
	if(isset($_COOKIE['ShoppingCart']) && $_COOKIE['ShoppingCart'] != "")
	{
		$dbh = connectToDatabase();
		// first check the user name is valid, if so fetch their customer ID
		// COLLATE NOCASE tells SQLite to do a case insensitive match.
		$statement1 = $dbh->prepare('SELECT CustomerID,Password FROM Customers WHERE UserName = ? ; '); //COLLATE NOCASE;
		$statement1->bindValue(1,$UserName);
		$statement1->execute();
		
		// did we find a match??
		if($row = $statement1->fetch(PDO::FETCH_ASSOC))
		{
			$Password = $row['Password'];

			//If the user has a password, verify with hash, if he doesn't then the field must be empty
			if(password_verify($UserPassword,$Password) || $UserPassword == $Password){
				// get their CustomerID
				$customerID = $row['CustomerID'];
				
				// now we want to add an order to the orders list.
				$statement2 = $dbh->prepare('INSERT INTO Orders (TimeStamp, CustomerID) VALUES (?,?); ');
				$statement2->bindValue(1,time());
				$statement2->bindValue(2,$customerID);
				$statement2->execute();			
				
				// get the OrderID of the order we just added to the database.
				$orderID = $dbh->lastInsertId();
				
				// now that we know the orderID, we can add the products in the users cart into the database
				$statement3 = $dbh->prepare('INSERT INTO OrderProducts (OrderID, ProductID, Quantity) VALUES (?,?,1); ');
				$statement3->bindValue(1,$orderID);
				
				// convert the comma separated list into an array so we can loop over it.
				$cartItems = explode(",", $_COOKIE['ShoppingCart']);
				
				// loop over each item in the shopping cart array.
				foreach($cartItems as $item)
				{
					$statement3->bindValue(2,$item);
					$statement3->execute();			
				}
				
				// order complete!, empty the cart and show them the order details
				deleteCookie("ShoppingCart");
				setCookieMessage("Order Success!!");
				redirect("ViewOrderDetails.php?OrderID=$orderID");
			}
			else
			{
				setCookieMessage("Invalid Username or Password!");
				redirect("ViewCart.php");
			}
		}
		else 
		{
			setCookieMessage("Invalid Username or Password!");
			redirect("ViewCart.php");
		}	
	}
	else 
	{
		setCookieMessage("You don't have any items in your cart!");
		redirect("ViewCart.php");
	}
}
else 
{
	echo "System Error: username not provided in ProcessOrder.php.";
}
