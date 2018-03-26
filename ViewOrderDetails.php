<!DOCTYPE HTML>
<html>
<head>
	<title>Your Order Details | TechnoShine.com</title>
	<link rel="stylesheet" type="text/css" href="shopstyle.css" />
	<link rel="shortcut icon" type="image/x-icon" href="Resources/logo.ico" />
	<meta charset="UTF-8" /> 
</head>
<body>

<?php

// did the user provided an OrderID via the URL?
if(isset($_GET['OrderID']))
{
	$UnsafeOrderID = $_GET['OrderID'];
	
	include('functions.php');
	include_once 'NavigationBar.php';
	$dbh = connectToDatabase();
	
	// select the order details and customer details. (you need to use an INNER JOIN)
	// but only show the row WHERE the OrderID is equal to $UnsafeOrderID.
	$statement = $dbh->prepare('SELECT * FROM Orders INNER JOIN Customers ON Customers.CustomerID = Orders.CustomerID WHERE OrderID = ? ;');
	$statement->bindValue(1,$UnsafeOrderID);
	$statement->execute();
	
	// did we get any results?
	if($row1 = $statement->fetch(PDO::FETCH_ASSOC))
	{
		// Output the Order Details.
		$FirstName = makeOutputSafe($row1['FirstName']); 
		$LastName = makeOutputSafe($row1['LastName']); 
		$OrderID = makeOutputSafe($row1['OrderID']); 
		$UserName = makeOutputSafe($row1['UserName']); 
		$Address = makeOutputSafe($row1['Address']);
		$City = makeOutputSafe($row1['City']);
		$TimeStamp = makeOutputSafe($row1['TimeStamp']);

		$Date = date('Y-m-d',$TimeStamp);
		$Time = date('h:i',$TimeStamp);
		
		// display the OrderID
		echo "<h2>OrderID: $OrderID</h2>";
		
		// its up to you how the data is displayed on the page. I have used a table as an example.
		// the first two are done for you.
		echo "<table class='viewOrderDetails-table'>";
		echo "<tr><th id='orderDetails-table-header'>UserName:</th><td>$UserName</td></tr>";
		echo "<tr><th id='orderDetails-table-header'>Customer Name:</th><td>$FirstName $LastName </td></tr>";
		
		//TODO show the Customers Address and City.
		echo "<tr><th id='orderDetails-table-header'>Address: </th><td>$Address</td></tr>";
		echo "<tr><th id='orderDetails-table-header'>City: </th><td>$City</td></tr>";
		//TODO show the date and time of the order.
		echo "<tr><th id='orderDetails-table-header'>Date: </th><td>$Date</td></tr>";
		echo "<tr><th id='orderDetails-table-header'>Time: </th><td>$Time</td></tr>";

		echo "</table>";
		
		// TODO: select all the products that are in this order (you need to use INNER JOIN)
		// this will involve three tables: OrderProducts, Products and Brands.
		$statement2 = $dbh->prepare('SELECT * FROM OrderProducts INNER JOIN Products ON OrderProducts.ProductID = Products.ProductID INNER JOIN Brands ON Products.BrandID = Brands.BrandID WHERE OrderID = ? ;');
		$statement2->bindValue(1,$UnsafeOrderID);
		$statement2->execute();
		
		$totalPrice = 0;
		echo "<h2>Order Details:</h2>";
		
		// loop over the products in this order. 
		while($row2 = $statement2->fetch(PDO::FETCH_ASSOC))
		{
			//NOTE: pay close attention to the variable names.
			$ProductID = makeOutputSafe($row2['ProductID']); 
			$Description = makeOutputSafe($row2['Description']); 
			$BrandName = makeOutputSafe($row2['BrandName']);
			$BrandID = makeOutputSafe($row2['BrandID']);
			$Price = makeOutputSafe($row2['Price']);
			$Website = makeOutputSafe($row2['Website']);
			$Quantity = makeOutputSafe($row2['Quantity']);
			
			// TODO show the Products Description, Brand, Price, Picture of the Product and a picture of the Brand.
			// TODO The product Picture must also be a link to ViewProduct.php.
			echo "<div class = 'view-product'>";
				echo "<img src='ITF_Assets/ProductPictures/$ProductID.jpg' />";
				echo "<a target='_blank' href='$Website'>
					<img id='brandPicture' src='ITF_Assets/BrandPictures/$BrandID.jpg' />
					</a>";
				echo "<hr>Description: $Description</hr><br/>";
				echo "<hr>Brand: $BrandName</hr><br/>";
				echo "<hr>Price: \$$Price</hr><br/>";
				echo "<hr>Quantity: $Quantity</hr><br/>";
			echo "</div> \n";
			// TODO add the price to the $totalPrice variable.
			$totalPrice += $Price * $Quantity;
		}		
		
		//TODO display the $totalPrice.
		echo "<h2>Total Price: \$$totalPrice<h2>";
	}
	else 
	{
		echo "System Error: OrderID not found";
	}
}
else
{
	echo "System Error: OrderID was not provided";
}
?>
</body>
</html>
