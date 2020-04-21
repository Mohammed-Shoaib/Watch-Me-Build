<!doctype html>
<html>
<head>
	<meta charset="UTF-8" /> 
	<title>Products | TechnoShine.com</title>
	<link rel="stylesheet" type="text/css" href="shopstyle.css" />
	<link rel="shortcut icon" type="image/x-icon" href="Resources/logo.ico" />
</head>
<body>
	<h1>Products List</h1>
	<?php 
		
		// include some functions from another file.
		include('functions.php');
		include_once 'NavigationBar.php';

		//Task 7A
		if(isset($_GET['search']))
		{
			$searchString = $_GET['search'];
		}
		else
		{
			$searchString = "";
		}

		$SqlSearchString = "%$searchString%";

		//Task 8B
		$safeSearchString = htmlspecialchars($searchString, ENT_QUOTES, "UTF-8");

		//Task 9
		if(isset($_GET['page']))
		{
			$currentPage = intval($_GET['page']);
		}
		else
		{
			$currentPage = 0;
		}

		$nextPage = $currentPage + 1;
		$previousPage = $currentPage - 1;

		if($previousPage < 0)
		{
			$previousPage = 0;
		}

		if(isset($_POST['Sort']))
			$sortBy = $_POST['sortBy'];
		else if(isset($_GET['sortBy']))
			$sortBy = $_GET['sortBy'];
		else
			$sortBy = 'Popularity';
		$safeSortBy = htmlspecialchars($sortBy,ENT_QUOTES,"UTF-8");

		//Task 7
		echo "<div class='sort-and-search'>";
			echo "<form class='search-product'>";
			echo "<button type='submit' name='submit'>Search</button>";
			echo "<input type='text' name='search' value='$safeSearchString' />";
			echo "</form>";

			//Additional Requirement: Task 4
			echo "<form class='sort-by' action='ProductList.php' method='POST'>";
				echo "<label>Sort By: </label>";
				echo "<select name='sortBy'>";
					switch ($sortBy) {
						case 'Popularity':
							echo "<option value='Popularity' selected>Popularity</option>";
							echo "<option value='AToZ'>Name: A to Z</option>";
							echo "<option value='ZToA'>Name: Z to A</option>";
							echo "<option value='LowToHigh'>Price: Low to High</option>";
							echo "<option value='HighToLow'>Price: High to Low</option>";
							break;

						case 'AToZ':
							echo "<option value='Popularity'>Popularity</option>";
							echo "<option value='AToZ' selected>Name: A to Z</option>";
							echo "<option value='ZToA'>Name: Z to A</option>";
							echo "<option value='LowToHigh'>Price: Low to High</option>";
							echo "<option value='HighToLow'>Price: High to Low</option>";
							break;

						case 'ZToA':
							echo "<option value='Popularity'>Popularity</option>";
							echo "<option value='AToZ'>Name: A to Z</option>";
							echo "<option value='ZToA' selected>Name: Z to A</option>";
							echo "<option value='LowToHigh'>Price: Low to High</option>";
							echo "<option value='HighToLow'>Price: High to Low</option>";
							break;

						case 'LowToHigh':
							echo "<option value='Popularity'>Popularity</option>";
							echo "<option value='AToZ'>Name: A to Z</option>";
							echo "<option value='ZToA'>Name: Z to A</option>";
							echo "<option value='LowToHigh' selected>Price: Low to High</option>";
							echo "<option value='HighToLow'>Price: High to Low</option>";
							break;

						case 'HighToLow':
							echo "<option value='Popularity'>Popularity</option>";
							echo "<option value='AToZ'>Name: A to Z</option>";
							echo "<option value='ZToA'>Name: Z to A</option>";
							echo "<option value='LowToHigh'>Price: Low to High</option>";
							echo "<option value='HighToLow' selected>Price: High to Low</option>";
							break;
					}
				echo "</select>";
				echo "<button type='submit' name='Sort'>Sort</button>";
			echo "</form>";
		echo "</div>";

		//Task 9B
		echo "<a class='previous-page' href='ProductList.php?page=$previousPage&search=$safeSearchString&sortBy=$safeSortBy'>Previous Page</a>";
		echo "<a class='next-page' href='ProductList.php?page=$nextPage&search=$safeSearchString&sortBy=$safeSortBy'>Next Page</a>";
		echo "<br/>";

		// connect to the database using our function (and enable errors, etc)
		$dbh = connectToDatabase();
		
		switch($sortBy){
			case 'Popularity':
				// select all the products.
				$statement = $dbh->prepare('SELECT * FROM Products LEFT JOIN OrderProducts ON OrderProducts.ProductID = Products.ProductID  WHERE Description LIKE ? GROUP BY Products.ProductID ORDER BY COUNT(OrderProducts.OrderID) DESC LIMIT 10 OFFSET ?;');
				break;
			case 'AToZ':
				$statement = $dbh->prepare('SELECT * FROM Products LEFT JOIN OrderProducts ON OrderProducts.ProductID = Products.ProductID  WHERE Description LIKE ? ORDER BY Description LIMIT 10 OFFSET ?;');
				break;
			case 'ZToA':
				$statement = $dbh->prepare('SELECT * FROM Products LEFT JOIN OrderProducts ON OrderProducts.ProductID = Products.ProductID  WHERE Description LIKE ? ORDER BY Description DESC LIMIT 10 OFFSET ?;');
				break;
			case 'LowToHigh':
				$statement = $dbh->prepare('SELECT * FROM Products LEFT JOIN OrderProducts ON OrderProducts.ProductID = Products.ProductID  WHERE Description LIKE ? ORDER BY Price LIMIT 10 OFFSET ?;');
				break;
			case 'HighToLow':
				$statement = $dbh->prepare('SELECT * FROM Products LEFT JOIN OrderProducts ON OrderProducts.ProductID = Products.ProductID  WHERE Description LIKE ? ORDER BY Price DESC LIMIT 10 OFFSET ?;');
				break;

			default:
				$statement = $dbh->prepare('SELECT * FROM Products LEFT JOIN OrderProducts ON OrderProducts.ProductID = Products.ProductID  WHERE Description LIKE ? GROUP BY Products.ProductID ORDER BY COUNT(OrderProducts.OrderID) DESC LIMIT 10 OFFSET ?;');
				break;
		}

		$statement->bindValue(1,$SqlSearchString);
		$statement->bindValue(2,$currentPage*10);
		
		//execute the SQL.
		$statement->execute();

		// get the results
		while($row = $statement->fetch(PDO::FETCH_ASSOC))
		{
			// Remember that the data in the database could be untrusted data. 
			// so we need to escape the data to make sure its free of evil XSS code.
			$ProductID = htmlspecialchars($row['ProductID'], ENT_QUOTES, 'UTF-8'); 
			$Price = htmlspecialchars($row['Price'], ENT_QUOTES, 'UTF-8'); 
			$Description = htmlspecialchars($row['Description'], ENT_QUOTES, 'UTF-8'); 
			
			// output the data in a div with a class of 'productBox' we can apply css to this class.
			echo "<div class = 'productBox'>";
			// [Put Task 5A here]  
			echo "<a href='ViewProduct.php?ProductID=$ProductID'>
			<img src='ITF_Assets/ProductPictures/$ProductID.jpg' />
			</a>";
			echo "<label id='Description'>$Description</label><br/>";
			echo "<label id='Price'>\$$Price</label><br/>";
			echo "</div> \n";			
		}
	?>
</body>
</html>