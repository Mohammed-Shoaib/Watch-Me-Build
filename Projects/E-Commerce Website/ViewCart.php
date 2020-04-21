<?php // <--- do NOT put anything before this PHP tag

include('functions.php');
include_once("NavigationBar.php");

// get the cookieMessage, this must be done before any HTML is sent to the browser.
$cookieMessage = getCookieMessage();

?>
<!doctype html>
<html>
<head>
	<meta charset="UTF-8" /> 
	<title>Your Shopping Cart | TechnoShine.com</title>
	<link rel="stylesheet" type="text/css" href="shopstyle.css" />
	<link rel="shortcut icon" type="image/x-icon" href="Resources/logo.ico" />
</head>
<body>
	<?php

	// does the user have items in the shopping cart?
	if(isset($_COOKIE['ShoppingCart']) && $_COOKIE['ShoppingCart'] != '')
	{
		// the shopping cart cookie contains a list of productIDs separated by commas
		// we need to split this string into an array by exploding it.
		$productID_list = explode(",", $_COOKIE['ShoppingCart']);
		
		// remove any duplicate items from the cart. although this should never happen we 
		// must make absolutely sure because if we don't we might get a primary key violation.
		$productID_list = array_unique($productID_list);
		
		$dbh = connectToDatabase();

		// create a SQL statement to select the product and brand info about a given ProductID
		// this SQL statement will be very similar to the one in ViewProduct.php
		// TODO the complete this SQL statment, you should read lectures 14 and 5.
		$statement = $dbh->prepare('SELECT * FROM Products INNER JOIN Brands ON Brands.BrandID = Products.BrandID WHERE ProductID = ?');

		$totalPrice = 0;
		
		// loop over the productIDs that were in the shopping cart.
		foreach($productID_list as $productID)
		{
			// great thing about prepared statements is that we can use them multiple times.
			// bind the first question mark to the productID in the shopping cart.
			$statement->bindValue(1,$productID);
			$statement->execute();
			
			// did we find a match?
			if($row = $statement->fetch(PDO::FETCH_ASSOC))
			{				
				//TODO Output information about the product. including pictures, description, brand etc.	
				$ProductID = htmlspecialchars($row['ProductID'], ENT_QUOTES, 'UTF-8'); 
				$Price = htmlspecialchars($row['Price'], ENT_QUOTES, 'UTF-8'); 
				$Description = htmlspecialchars($row['Description'], ENT_QUOTES, 'UTF-8'); 
				$BrandID = htmlspecialchars($row['BrandID'], ENT_QUOTES, 'UTF-8'); 
				$BrandName = htmlspecialchars($row['BrandName'], ENT_QUOTES, 'UTF-8'); 
				$Website = htmlspecialchars($row['Website'], ENT_QUOTES, 'UTF-8'); 
				
				// output the data in a div with a class of 'productBox' we can apply css to this class.
				echo "<div class = 'view-product'>";
				echo "<img src='ITF_Assets/ProductPictures/$ProductID.jpg' />";
				echo "<a target='_blank' href='$Website'>
					<img id='brandPicture' src='ITF_Assets/BrandPictures/$BrandID.jpg' />
					</a>";
				echo "<hr>$Description</hr><br/>";
				echo "<hr>$BrandName</hr><br/>";
				echo "<hr>\$$Price</hr><br/>";
				echo "<form action='RemoveFromCart.php?ProductID=$ProductID' method='POST'>";
					echo "<button id='remove-product' type='submit' name='RemoveButton'>Remove From Cart</button>";
				echo "</form>";
				echo "</div> \n";			
				//TODO add the price of this item to the $totalPrice
				$totalPrice += $Price;
			}
		}

		// TODO: output the $totalPrice.
		echo "<h2>Total Price: \$$totalPrice</h2>";
		
		// you are allowed to stop and start the PHP tags so you don't need to use lots of echo statements.
		?>
		<div class='order-form'>
			<form class='confirm-order' action = 'LoginPage.php' method = 'POST'>
			
				<!-- TODO put a text input here so the user can type in their UserName.
					 this input tag MUST have its name attribute set to 'UserName' -->
			
				<!-- TODO put a submit button so the user can submit the form -->
				<button type='submit' name='ConfirmOrderButton'>Confirm Order</button>
				 
			</form>

			<form class='empty-cart' action = 'EmptyCart.php' method = 'POST'>
			<button type = 'submit' name = 'EmptyCartButton'>Empty Shopping Cart</button>
			<!--
			<input type = 'submit' name = 'EmptyCart' value = 'Empty Shopping Cart' id = 'EmptyCart' />
			-->
			</form>
		</div>
		<?php 		
		// if we have any error messages echo them now. TODO style this message so that it is noticeable.
		echo "<h3>$cookieMessage</h3>";
	}
	else
	{
		// if we have any error messages echo them now. TODO style this message so that it is noticeable.
		echo "<h2>$cookieMessage</h2><br/>";
		
		echo "<h2>You Have no items in your cart!</h2>";
	}
	?>
</body>
</html>
