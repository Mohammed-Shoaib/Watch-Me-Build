<?php // <--- do NOT put anything before this PHP tag

include('functions.php');

// did they click the empty cart button?
if(isset($_POST['EmptyCartButton']))
{
	deleteCookie('ShoppingCart');
	setCookieMessage("Your Cart Has been emptied");
	redirect("ViewCart.php");
}
else
{
	echo "System Error: button not pressed";
}