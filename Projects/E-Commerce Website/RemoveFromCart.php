<?php

	include('functions.php');

	if(isset($_POST['RemoveButton']) && isset($_GET['ProductID'])){
		$productToRemove = trim($_GET['ProductID']);

		if(isset($_COOKIE['ShoppingCart']) && $_COOKIE['ShoppingCart'] != "")
		{
			$cartItems = explode(",", $_COOKIE['ShoppingCart']);
			if(sizeof($cartItems) > 1){
				$flag = false;
				// loop over each item in the shopping cart array.
				for($i=0 ; $i<sizeof($cartItems) ; $i++)
				{
					if($cartItems[$i] != $productToRemove && !$flag){
						$listOfItems = $cartItems[$i];
						$flag = true;
					}
					else if($cartItems[$i] != $productToRemove && $flag)
						$listOfItems = $listOfItems.','.$cartItems[$i];
				}
				setcookie('ShoppingCart',$listOfItems);
			}
			else{
				deleteCookie('ShoppingCart');
				setCookieMessage("Your Cart Has been emptied");
			}
			redirect("ViewCart.php");
		}
	}