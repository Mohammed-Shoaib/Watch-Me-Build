<?php // <--- do NOT put anything before this PHP tag
	include('functions.php');
	$cookieMessage = getCookieMessage();
?>
<!doctype html>
<html>
<head>
	<meta charset="UTF-8" /> 
	<title>Online Shopping with Technoshine</title>
	<link rel="stylesheet" type="text/css" href="shopstyle.css" />
	<link rel="shortcut icon" type="image/x-icon" href="Resources/logo.ico" />
</head>
<body id="home-page">
	
	<?php
		include_once 'NavigationBar.php';
	?>

	<h1 id='TechnoShine'>TechnoShine</h1>
	<marquee class="GeneratedMarquee" direction="left" scrollamount="25" behavior="scroll">Welcome to TechnoShine! -The Online Shop for Electronics</marquee>
	<?php
		// display any cookie messages. TODO style this message so that it is noticeable.
		echo "<h3>$cookieMessage</h3>";
	?>
	
		<!-- 
		
			// TODO put a search box here and a submit button.
			
			// TODO the rest of this page is your choice, but you must not leave it blank.
			
			Possible ideas:
			•	List the 10 most recently purchased products.
			•	Use a CSS Animated Slider.
			•	Display any sales or promotions (using an image)

		-->
		<form class='search-home' action='ProductList.php' method='GET'>
			<button type='submit' name='submit'>Search</button>
			<input type='text' name='search' >
		</form>

		<?php

		// connect to the database using our function (and enable errors, etc)
		$dbh = connectToDatabase();
		
		echo "<div id='slider'>";
			echo "<div class='animation-slider'>";
				echo "<figure>";

					$ProductID = '';
					$Price = '';

					$SqlSearchString = '%Samsung Gear%';
					$statement = $dbh->prepare('SELECT * FROM Products INNER JOIN Brands ON Brands.BrandID = Products.BrandID WHERE Description LIKE ? ;');
					$statement->bindValue(1,$SqlSearchString);
					$statement->execute();

					if($row = $statement->fetch(PDO::FETCH_ASSOC)){
						$ProductID = htmlspecialchars($row['ProductID'],ENT_QUOTES,'UTF-8');
						$Price = htmlspecialchars($row['Price'],ENT_QUOTES,'UTF-8');
					}

					echo "<div>";
							echo "<a href='ViewProduct.php?ProductID=$ProductID'>";
									echo "<p id='slider-p'>\$$Price!</p>";
									echo "<img id='slider-img' src='Resources/SamsungWatch.jpg'>";
							echo "</a>";
					echo "</div>";

					$SqlSearchString = '%LG 55 Inch%';
					$statement = $dbh->prepare('SELECT * FROM Products INNER JOIN Brands ON Brands.BrandID = Products.BrandID WHERE Description LIKE ? ;');
					$statement->bindValue(1,$SqlSearchString);
					$statement->execute();

					if($row = $statement->fetch(PDO::FETCH_ASSOC)){
						$ProductID = htmlspecialchars($row['ProductID'],ENT_QUOTES,'UTF-8');
						$Price = htmlspecialchars($row['Price'],ENT_QUOTES,'UTF-8');
					}

					echo "<div>";
							echo "<a href='ViewProduct.php?ProductID=$ProductID'>";
								echo "<p id='slider-p'>\$$Price!</p>";
								echo "<img id='slider-img' src='Resources/LG_TV.jpg'>";
							echo "</a>";
					echo "</div>";

					$SqlSearchString = '%Razer Tiamat%';
					$statement = $dbh->prepare('SELECT * FROM Products INNER JOIN Brands ON Brands.BrandID = Products.BrandID WHERE Description LIKE ? ;');
					$statement->bindValue(1,$SqlSearchString);
					$statement->execute();

					if($row = $statement->fetch(PDO::FETCH_ASSOC)){
						$ProductID = htmlspecialchars($row['ProductID'],ENT_QUOTES,'UTF-8');
						$Price = htmlspecialchars($row['Price'],ENT_QUOTES,'UTF-8');
					}

					echo "<div>";
							echo "<a href='ViewProduct.php?ProductID=$ProductID'>";
								echo "<p id='slider-p'>\$$Price!</p>";
								echo "<img id='slider-img' src='Resources/RazerHeadset.jpg'>";
							echo "</a>";
					echo "</div>";

					$SqlSearchString = '%Canon EOS 80D%';
					$statement = $dbh->prepare('SELECT * FROM Products INNER JOIN Brands ON Brands.BrandID = Products.BrandID WHERE Description LIKE ? ;');
					$statement->bindValue(1,$SqlSearchString);
					$statement->execute();

					if($row = $statement->fetch(PDO::FETCH_ASSOC)){
						$ProductID = htmlspecialchars($row['ProductID'],ENT_QUOTES,'UTF-8');
						$Price = htmlspecialchars($row['Price'],ENT_QUOTES,'UTF-8');
					}

					echo "<div>";
							echo "<a href='ViewProduct.php?ProductID=$ProductID'>";
								echo "<p id='slider-p'>\$$Price!</p>";
								echo "<img id='slider-img' src='Resources/CanonCamera.jpg'>";
							echo "</a>";
					echo "</div>";


					$SqlSearchString = '%Sony Home Cinema%';
					$statement = $dbh->prepare('SELECT * FROM Products INNER JOIN Brands ON Brands.BrandID = Products.BrandID WHERE Description LIKE ? ;');
					$statement->bindValue(1,$SqlSearchString);
					$statement->execute();

					if($row = $statement->fetch(PDO::FETCH_ASSOC)){
						$ProductID = htmlspecialchars($row['ProductID'],ENT_QUOTES,'UTF-8');
						$Price = htmlspecialchars($row['Price'],ENT_QUOTES,'UTF-8');
					}

					echo "<div>";
							echo "<a href='ViewProduct.php?ProductID=$ProductID'>";
								echo "<p id='slider-p'>\$$Price!</p>";
								echo "<img id='slider-img' src='Resources/SongHomeTheater.jpg'>";
							echo "</a>";
					echo "</div>";

				echo "</figure>";
			echo "</div>";
		echo "</div>";

		?>
		<div class="parallax">

			<div id="bg1">
    			<h1>A Glance....</h1>
				<p>In Today's era of rapid growth and developement of technology, Online shopping is one amongst the major breakthrough in this consent,
                where one can just sit back , have a glance at variety of products and all you want comes to your doorstep! </p>
			</div>
			<div id="bg2">	
				<h1>Our Vision</h1>
				<p> Here, At TechnoShine - the online shop for electronics, we try and give our customers nothing less than the best of the products, 
                keeping in mind all aspects of catering our customer's needs , the quality of the products provided to them and to top it all up , it's cost-effective too!
                We believe , we are here for you! We are here because of you!
                Our sole agenda is to provide the best of the products , that can cater your needs at an affordable price.
                Well, keeping in mind , the affordablity , we do not and NEVER compromise on the quality of our products!<br/>
                So, a heartfelt welcome to all our lovely customers into this family!<br/> 
                "BECAUSE WE ARE HERE FOR YOU !<br/> 
                AND HERE BECAUSE OF YOU!<br/>
                WE ARE ALL A FAMILY!"
                </p>
			</div>
			<div id="bg3">
				<h1>Announcement!</h1>
				<p>Greetings to all our lovely customers!!
                    TechnoShine is soon going to be launching it's premium class membership scheme,
                    where by our premium class members will be offered special rebates on hourly-deals 
                    and will be provided on- demand amenity too..! where in certain products will be launched and bought to you as per your demand!
                    and any further rebates will be notified to our premium class members prior itself!<br/> 
                    So, dear customers , please keep an eye on the website, as this golden oppurtunity is gonna knock on your doors soon!<br/> 
                    Stay tuned!</p>

			</div>
	</div>
</body>
</html>