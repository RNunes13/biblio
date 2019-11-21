<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: access");
  header("Access-Control-Allow-Methods: GET");
  header("Access-Control-Allow-Credentials: true");
  header('Content-Type: application/json');
  
  include_once '../config/database.php';
  include_once '../models/user_address.php';
  
  $database = new Database();
  $db = $database->getConnection();
  $user_address = new UserAddress($db);

  $user_address->user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

  $resp = $user_address->getByUser();

  if ($resp) {
    http_response_code(200);
    echo json_encode($resp);
  } else {
    http_response_code(404);
    echo json_encode(array("message" => "UserAddress does not exist with user_id = " . $_GET['user_id']));
  }
?>