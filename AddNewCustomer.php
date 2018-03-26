<?php // <--- do NOT put anything before this PHP tag

// this php file will have no HTML

include('functions.php');

if(isset($_POST['UserName'],$_POST['FirstName'],$_POST['LastName'],$_POST['Address'],$_POST['City']))
{
	$dbh = connectToDatabase();
	
	//TODO trim all 5 inputs, to make sure they have no extra spaces.
	$UserName = trim($_POST['UserName']);
	$FirstName = trim($_POST['FirstName']);
	$LastName = trim($_POST['LastName']);
	$Address = trim($_POST['Address']);
	$City = trim($_POST['City']);
	$Password1 = trim($_POST['Password1']);
	$Password2 = trim($_POST['Password2']);

	// lets check to see if the user name is taken, COLLATE NOCASE tells SQLite to do a case insensitive match.
	$statement = $dbh->prepare('SELECT * FROM Customers WHERE UserName = ? ;');		//COLLATE NOCASE;
	$statement->bindValue(1, $UserName);
	$statement->execute();
		
	// we found a match, so inform the user that they cant use the user-name.
	if( empty($FirstName) || empty($LastName) || empty($UserName) || empty($Address) || empty($City) || empty($Password1) || empty($Password2))
	{
		setCookieMessage("Please enter all the fields");
		redirect("SignUp.php?FirstName=$FirstName&LastName=$LastName&UserName=$UserName&Address=$Address&City=$City&Password1=$Password1&Password2=$Password2");
	}
	else if($row2 = $statement->fetch(PDO::FETCH_ASSOC))
	{
		setCookieMessage("The UserName: '$UserName' is Taken by someone else :(");
		redirect("SignUp.php?FirstName=$FirstName&LastName=$LastName&UserName=$UserName&Address=$Address&City=$City&Password1=$Password1&Password2=$Password2");
	}
	else if($Password1 != $Password2)
	{
		setCookieMessage("Passwords don't match!");
		redirect("SignUp.php?FirstName=$FirstName&LastName=$LastName&UserName=$UserName&Address=$Address&City=$City&Password1=&Password2=");
	}
	else
	{		
		// add the new customer to the customers table.
		// TODO insert the new customer and their details into the Customers table.
		// NOTE: you must NOT provide the customerID, the database will generate one for you.
		$statement2 = $dbh->prepare('INSERT INTO Customers(FirstName,LastName,UserName,Address,City,Password)
			VALUES(? , ? , ? , ? , ?, ?)');
		
		$Password = password_hash($Password1, PASSWORD_DEFAULT);

		// TODO: bind the 5 variables to the question marks. the first one is done for you.
		$statement2->bindValue(1, $FirstName);
		$statement2->bindValue(2,$LastName);
		$statement2->bindValue(3,$UserName);
		$statement2->bindValue(4,$Address);
		$statement2->bindValue(5,$City);
		$statement2->bindValue(6,$Password);
		
		$statement2->execute();
		setCookieMessage("Welcome $FirstName!, you can now buy some products!");
		redirect("Homepage.php");		
	}
}
else 
{
	echo "System Error: invalid data provided";
}