<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
  include_once '../config/database.php';
  include_once '../models/user.php';
  
  $database = new Database();
  $db = $database->getConnection();
  
  $user = new User($db);
  
  $data = json_decode(file_get_contents("php://input"));
  
  if (!empty($data->username)) {
    $resp = $user->checkUsername($data->username, $data->usernameUser);

    if ($resp["success"]) {
      http_response_code(200);
      echo json_encode($resp["available"]);
    } else {
      http_response_code(500);
      echo json_encode($resp);
    }
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to verify username. Data is incomplete."));
  }
?>