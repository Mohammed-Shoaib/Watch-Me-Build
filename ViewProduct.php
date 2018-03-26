<!doctype html>
<html>
<head>
	<meta charset="UTF-8" /> 
	<link rel="stylesheet" type="text/css" href="shopstyle.css" />
	<link rel="shortcut icon" type="image/x-icon" href="Resources/logo.ico" />
	<?php 
		
		// include some functions from another file.
		include('functions.php');
		include_once 'NavigationBar.php';

		if(isset($_GET['ProductID']))
		{		
			$productID = $_GET['ProductID'];
			// connect to the database using our function (and enable errors, etc)
			$dbh = connectToDatabase();

			// select all the products with the specified ID.
			$statement = $dbh->prepare('SELECT * FROM Products INNER JOIN Brands ON Brands.BrandID = Products.BrandID WHERE ProductID = ?');
			
			// TODO: bind the value here
			$statement->bindValue(1,$productID);
			
			//execute the SQL.
			$statement->execute();


			//Checking if product already exist in cookie ShoppingCart
			if(isset($_COOKIE['ShoppingCart']))
				$productID_list = $_COOKIE['ShoppingCart'];
			else
				$productID_list = "";
			$productID_list = explode(',', $productID_list);
			$flag = false;
			foreach ($productID_list as $value)
				if($value == $productID)
					$flag = true;

			// get the result, there will only ever be one product with a given ID (because products ids must be unique)
			// so we can just use an if() rather than a while()
			if($row = $statement->fetch(PDO::FETCH_ASSOC))
			{
				// display the details here.
				$ProductID = htmlspecialchars($row['ProductID'], ENT_QUOTES, 'UTF-8'); 
				$Price = htmlspecialchars($row['Price'], ENT_QUOTES, 'UTF-8'); 
				$Description = htmlspecialchars($row['Description'], ENT_QUOTES, 'UTF-8'); 
				$BrandID = htmlspecialchars($row['BrandID'], ENT_QUOTES, 'UTF-8'); 
				$BrandName = htmlspecialchars($row['BrandName'], ENT_QUOTES, 'UTF-8'); 
				$Website = htmlspecialchars($row['Website'], ENT_QUOTES, 'UTF-8'); 
				
					echo "<title>$Description</title>";
				echo "</head>";
				echo "<body>";
					echo "<h1>Products List</h1>";
					// output the data in a div with a class of 'productBox' we can apply css to this class.
					echo "<div class = 'view-product'>";
					echo "<img src='ITF_Assets/ProductPictures/$ProductID.jpg' />";
					echo "<a target='_blank' href='$Website'>
						<img id='brandPicture' src='ITF_Assets/BrandPictures/$BrandID.jpg' />
						</a>";
					echo "<hr>$Description</hr><br/>";
					echo "<hr>$BrandName</hr><br/>";
					echo "<hr>\$$Price</hr><br/>";
					if(!$flag){
						echo "<form action='AddToCart.php?ProductID=$ProductID' method='POST'>";
						echo "<button id='add-product' type='submit' name='BuyButton'>Add to Cart</button>";
						echo "</form>";
					}
					echo "</div> \n";
			}
			else
			{
				echo "Unknown Product ID";
			}
		}
		else
		{
			echo "No ProductID provided!";
		}
	?>
</body>
</html>