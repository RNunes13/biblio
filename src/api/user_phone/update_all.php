<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../models/user_phone.php';

  $database = new Database();
  $db = $database->getConnection();

  $user_phone = new UserPhone($db);

  $phones = json_decode(file_get_contents("php://input"));

  foreach ($phones as $phone) {
    if (
      !empty($phone->id) &&
      !empty($phone->ddd) &&
      !empty($phone->number)
    ) {
      $user_phone->id = $phone->id;
      $user_phone->ddd = $phone->ddd;
      $user_phone->number = $phone->number;
  
      $resp = $user_phone->update();
    } else {
      continue;
    }
  }

  http_response_code(200);
  echo json_encode("UserPhone updated");
?>