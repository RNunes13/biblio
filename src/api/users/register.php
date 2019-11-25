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
  
  if (
    !empty($data->name) &&
    !empty($data->username) && 
    !empty($data->email) && 
    !empty($data->password)
  ) {
    $user->name = $data->name;
    $user->username = $data->username;
    $user->email = $data->email;
    $user->password = $data->password;

    $resp = $user->create();

    if ($resp["success"]) {
      http_response_code(201);
      echo json_encode($resp["data"]);
    } else {
      http_response_code(503);
      echo json_encode(array("message" => $resp["message"]));
    }
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
  }
?>