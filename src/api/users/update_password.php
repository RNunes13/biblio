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
    !empty($data->userId) &&
    !empty($data->currentPassword) &&
    !empty($data->newPassword)
  ) {
    $resp = $user->updatePassword($data->userId, $data->currentPassword, $data->newPassword);

    if ($resp["success"]) {
      http_response_code(200);
      echo json_encode($resp["success"]);
    } else {
      http_response_code(500);
      echo json_encode($resp);
    }
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to verify username. Data is incomplete."));
  }
?>