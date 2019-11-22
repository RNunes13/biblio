<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: PUT");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../models/user_address.php';

  $database = new Database();
  $db = $database->getConnection();

  $user_address = new UserAddress($db);

  $addresses = json_decode(file_get_contents("php://input"));

  foreach ($addresses as $address) {
    if (
      !empty($address->id) &&
      !empty($address->zip_code) &&
      !empty($address->street) &&
      !empty($address->number) &&
      !empty($address->additional) &&
      !empty($address->neighborhood) &&
      !empty($address->city) &&
      !empty($address->uf)
    ) {
      $user_address->id = $address->id;
      $user_address->zip_code = $address->zip_code;
      $user_address->street = $address->street;
      $user_address->number = $address->number;
      $user_address->additional = $address->additional;
      $user_address->neighborhood = $address->neighborhood;
      $user_address->city = $address->city;
      $user_address->uf = $address->uf;
  
      $resp = $user_address->update();
    } else {
      continue;
    }
  }

  http_response_code(200);
  echo json_encode("UserAddress updated");
?>