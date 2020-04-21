<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>All the Orders | TechnoShine.com</title>
	<link rel="stylesheet" type="text/css" href="shopstyle.css">
	<link rel="shortcut icon" type="image/x-icon" href="Resources/logo.ico" />
</head>
<body>
	<h1>Order List</h1>
	<table>
		<tr id="table-header">
			<th>CustomerID</th>
			<th>Username</th>
			<th>Name</th>
			<th>Address</th>
			<th>City</th>
			<th>Time Placed</th>
			<th>OrderID</th>
		</tr>

		<?php
			// include some functions from another file.
			include('functions.php');
			include_once 'NavigationBar.php';

			if(isset($_GET['page']))
				$currentPage = $_GET['page'];
			else
				$currentPage = 0;

			//For next page, Total 260 rows
			if($currentPage < 7)
				$nextPage = $currentPage + 1;
			else
				$nextPage = $currentPage;

			//For previous page
			if($currentPage > 0)
				$previousPage = $currentPage - 1;
			else
				$previousPage = $currentPage;


			echo "<a id='previouspage-order'href='OrderList.php?page=$previousPage'>Previous Page</a>";
			echo "<a id='nextpage-order' href='OrderList.php?page=$nextPage'>Next Page</a>";

			$dbh = connectToDatabase();

			$statement = $dbh->prepare('SELECT * FROM Orders INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID ORDER BY Customers.CustomerID LIMIT 40 OFFSET ?;');
			$statement->bindValue(1,$currentPage*40);
			$statement->execute();

			$CustomerIDArr = array();
			$UserNameArr = array();
			$FirstNameArr = array();
			$LastNameArr = array();
			$AddressArr = array();
			$CityArr = array();
			$OrderIDArr = array();
			$TimeStampArr = array();

			while( $row = $statement->fetch(PDO::FETCH_ASSOC) ){
				$CustomerID = htmlspecialchars($row['CustomerID'],ENT_QUOTES,'UTF-8');
				$UserName = htmlspecialchars($row['UserName'],ENT_QUOTES,'UTF-8');
				$FirstName = htmlspecialchars($row['FirstName'],ENT_QUOTES,'UTF-8');
				$LastName = htmlspecialchars($row['LastName'],ENT_QUOTES,'UTF-8');
				$Address = htmlspecialchars($row['Address'],ENT_QUOTES,'UTF-8');
				$City = htmlspecialchars($row['City'],ENT_QUOTES,'UTF-8');
				$TimeStamp = htmlspecialchars($row['TimeStamp'],ENT_QUOTES,'UTF-8');
				$OrderID = htmlspecialchars($row['OrderID'],ENT_QUOTES,'UTF-8');

				//Converting Unix to date or doing an Epoch Conversion
				$TimeStamp = date('Y-m-d h:i:s',$TimeStamp);

				array_push($CustomerIDArr,$CustomerID);
				array_push($UserNameArr,$UserName);
				array_push($FirstNameArr,$FirstName);
				array_push($LastNameArr,$LastName);
				array_push($AddressArr,$Address);
				array_push($CityArr,$City);
				array_push($TimeStampArr,$TimeStamp);
				array_push($OrderIDArr,$OrderID);
			}

			$arr = array();

			for ($i = 0 ; $i < sizeof($OrderIDArr) ; $i++){
		        $CustomerID = $CustomerIDArr[$i];

		        //If there is no CustomerID, create one
		        if (!isset($arr[$CustomerID])) {
		            $arr[$CustomerID] = array();
		            $arr[$CustomerID]['rowspan'] = 0;
		        }

		        $arr[$CustomerID]['printed'] = "no";

		        //Increment the row span value.
		        $arr[$CustomerID]['rowspan'] += 1;
		    }
			
			for($i=0 ; $i < sizeof($OrderIDArr) ; $i++) {
		        $CustomerID = $CustomerIDArr[$i];
		        $UserName = $UserNameArr[$i];
		        $FirstName = $FirstNameArr[$i];
		        $LastName = $LastNameArr[$i];
		        $Address = $AddressArr[$i];
		        $City = $CityArr[$i];

		        echo "<tr id='orderlist-table'>";

		        # If this row is not printed then print.
		        # and make the printed value to "yes", so that
		        # next time it will not printed.
		        if ($arr[$CustomerID]['printed'] == 'no') {
		            echo "<td rowspan='".$arr[$CustomerID]['rowspan']."'>".$CustomerID."</td>";
		            echo "<td rowspan='".$arr[$CustomerID]['rowspan']."'>".$UserName."</td>";
		            echo "<td rowspan='".$arr[$CustomerID]['rowspan']."'>".$FirstName." ".$LastName."</td>";
		            echo "<td rowspan='".$arr[$CustomerID]['rowspan']."'>".$Address."</td>";
		            echo "<td rowspan='".$arr[$CustomerID]['rowspan']."'>".$City."</td>";
		            $arr[$CustomerID]['printed'] = 'yes';
		        }
		        echo "<td>".$TimeStampArr[$i]."</td>";
		        echo "<td>".$OrderIDArr[$i]."</td>";
		        echo "</tr>";
		    }

		?>
	</table>
</body>
</html>