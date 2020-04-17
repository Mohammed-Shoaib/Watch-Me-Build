<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>All the Customers | TechnoShine.com</title>
	<link rel="stylesheet" type="text/css" href="shopstyle.css">
	<link rel="shortcut icon" type="image/x-icon" href="Resources/logo.ico" />
</head>
<body>
	<h1>Customer List</h1>
	<table class="customerlist-table">
		<tr id="table-header">
			<th>CustomerID</th>
			<th>Username</th>
			<th>Name</th>
			<th>Address</th>
			<th>City</th>
		</tr>
		<?php 
			
			// include some functions from another file.
			include('functions.php');
			include_once 'NavigationBar.php';

			if(isset($_GET['page']))
				$currentPage = $_GET['page'];
			else
				$currentPage = 0;

			//For next page, Total 200 rows
			if($currentPage < 5)
				$nextPage = $currentPage + 1;
			else
				$nextPage = $currentPage;

			//For previous page
			if($currentPage > 0)
				$previousPage = $currentPage - 1;
			else
				$previousPage = $currentPage;


			echo "<a id='previouspage-customer'href='CustomerList.php?page=$previousPage'>Previous Page</a>";
			echo "<a id='nextpage-customer' href='CustomerList.php?page=$nextPage'>Next Page</a>";

			$dbh = connectToDatabase();

			$statement = $dbh->prepare('SELECT * FROM Customers LIMIT 40 OFFSET ?;');
			$statement->bindValue(1,$currentPage*40);
			$statement->execute();

			while( $row = $statement->fetch(PDO::FETCH_ASSOC) )
			{
				$CustomerID = htmlspecialchars($row['CustomerID'],ENT_QUOTES,'UTF-8');
				$UserName = htmlspecialchars($row['UserName'],ENT_QUOTES,'UTF-8');
				$FirstName = htmlspecialchars($row['FirstName'],ENT_QUOTES,'UTF-8');
				$LastName = htmlspecialchars($row['LastName'],ENT_QUOTES,'UTF-8');
				$Address = htmlspecialchars($row['Address'],ENT_QUOTES,'UTF-8');
				$City = htmlspecialchars($row['City'],ENT_QUOTES,'UTF-8');

				echo "<tr>
						<td>$CustomerID</td>
						<td>$UserName</td>
						<td>$FirstName $LastName</td>
						<td>$Address</td>
						<td>$City</td>
					</tr>";
			}
		?>
	</table>
</body>
</html>