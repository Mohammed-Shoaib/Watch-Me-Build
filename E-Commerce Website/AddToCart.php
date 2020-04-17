<?php // <--- do NOT put anything before this PHP tag

include('functions.php');

// Did the user click the buy button AND did they provide a ProductID?
if(isset($_POST['BuyButton']) && isset($_GET['ProductID']))
{
	$productToBuy = trim($_GET['ProductID']);
	
	// add the product to the shopping cart cookie
	// if the cookie is defined AND not an empty string
	if(isset($_COOKIE['ShoppingCart']) && $_COOKIE['ShoppingCart'] != "")
	{
		// TODO: Get the list of items in the shopping cart.
		// and then add the $productToBuy to the end of the comma separated list.
		
		// --> you may want to check lecture 14. <--
		$listOfItems = $_COOKIE['ShoppingCart'];
		echo "<h1>$listOfItems</h1>";
		$listOfItems = $listOfItems.','.$productToBuy;
		
		// TODO: set the "ShoppingCart" cookie (notice the capital letters).
		// setcookie(...);
		setcookie('ShoppingCart',$listOfItems);
	}
	else 
	{
		// add this productID to the shopping cart.
		// because this is the first item in the cart no commas are required.
		
		// TODO: set the "ShoppingCart" cookie (notice the capital letters).
		// setcookie(...);
		setcookie('ShoppingCart',$productToBuy);
	}
	// redirect the user back to ViewProduct.php 
	redirect("ViewProduct.php?ProductID=$productToBuy");
}
else 
{
	echo "System Error: button not pressed or ProductID provided";
}