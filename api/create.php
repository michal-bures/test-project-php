<?php
$app = require_once dirname(__FILE__)."/../core/app.php";

// Create new instance of user
$user = new User($app->db);
// Insert it to database with POST data
$result = $user->insert(array(
	'name' => $_POST['name'] ?? '',
	'email' => $_POST['email'] ?? '',
	'city' => $_POST['city']  ?? ''
));

// Return result as json
header('Content-Type: application/json');
echo json_encode($result);
