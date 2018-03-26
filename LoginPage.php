<?php // <--- do NOT put anything before this PHP tag
	
	include('functions.php');
	include_once 'NavigationBar.php';

	echo "<link rel='stylesheet' type='text/css' href='shopstyle.css'>";
	echo "<link rel='shortcut icon' type='image/x-icon' href='Resources/logo.ico' />";

	echo "<h2>Please login to your account.</h2>";
	
	echo "<div>";
		echo "<form  class='login-page' action = 'ProcessOrder.php' method = 'POST'>";
			echo "<fieldset>";
				echo "<input type='text' name='UserName' placeholder='Username'><br/>";
				echo "<input type='password' name='UserPassword' placeholder='Password'><br/>";
				echo "<button type='submit' name='submit'>Login</button>";
			echo "</fieldset>";
		echo "</form>";
	echo "</div>";