<?php // <--- do NOT put anything before this PHP tag
	include('functions.php');
	$cookieMessage = getCookieMessage();
?>
<!doctype html>
<html>
<head>
	<meta charset="UTF-8" /> 
	<title>Sign Up | TechnoShine.com</title>
	<link rel="stylesheet" type="text/css" href="shopstyle.css" />
	<link rel="shortcut icon" type="image/x-icon" href="Resources/logo.ico" />
</head>
<body>

	<?php
		include_once 'NavigationBar.php';
	?>

	<h1>Create your account</h1>
	<?php
		// display any error messages. TODO style this message so that it is noticeable.
		echo "<h3>$cookieMessage</h3>";
	?>
	
	<div>
		<form  class="signup-page" action = 'AddNewCustomer.php' method = 'POST'>
			<!-- 
				TODO make a sign up <form>, don't forget to use <label> tags, <fieldset> tags and placeholder text. 
				all inputs are required.
				
				Make sure you <input> tag names match the names in AddNewCustomer.php
				
				your form tag should use the POST method. don't forget to specify the action attribute.
			-->
			<fieldset >
			<?php
				$FirstName = '';
				$LastName = '';
				$UserName = '';
				$Address = '';
				$City = '';
				$Password1 = '';
				$Password2 = '';

				if(isset($_GET['FirstName']))
					$FirstName = $_GET['FirstName'];
				if(isset($_GET['LastName']))
					$LastName = $_GET['LastName'];
				if(isset($_GET['UserName']))
					$UserName = $_GET['UserName'];
				if(isset($_GET['Address']))
					$Address = $_GET['Address'];
				if(isset($_GET['City']))
					$City = $_GET['City'];
				if(isset($_GET['Password1']))
					$Password1 = $_GET['Password1'];
				if(isset($_GET['Password2']))
					$Password2 = $_GET['Password2'];

				$FirstName = htmlspecialchars($FirstName,ENT_QUOTES,"UTF-8");
				$LastName = htmlspecialchars($LastName,ENT_QUOTES,'UTF-8');
				$UserName = htmlspecialchars($UserName,ENT_QUOTES,'UTF-8');
				$Address = htmlspecialchars($Address,ENT_QUOTES,'UTF-8');
				$City = htmlspecialchars($City,ENT_QUOTES,'UTF-8');

				echo "<label for='FirstName'>First Name: </label><br/>";
				echo "<input type='text' name='FirstName' placeholder='First Name' value='$FirstName'><br/>";
				echo "<label for='LastName'>Last Name: </label><br/>";
				echo "<input type='text' name='LastName' placeholder='Last Name' value='$LastName'><br/>";
				echo "<label for='Address'>Address: </label><br/>";
				echo "<input type='text' name='Address' placeholder='Address' value='$Address'><br/>";
				echo "<label for='City'>City: </label><br/>";
				echo "<input type='text' name='City' placeholder='City' value='$City'><br/>";
				echo "<label for='UserName'>Create a Username: </label><br/>";
				echo "<input type='text' name='UserName' placeholder='Username' value='$UserName'><br/>";
				echo "<label for='Password'>Create a Password: </label><br/>";
				echo "<input type='Password' name='Password1' placeholder='Password' value='$Password1'><br/>";
				echo "<label for='Password'>Confirm Password: </label><br/>";
				echo "<input type='Password' name='Password2' placeholder='Password' value='$Password2'><br/>";
				echo "<button type='submit' name='submit'>Sign Up!</button>";
			?>
			</fieldset>
		</form>
	</div>
	
</body>
</html>