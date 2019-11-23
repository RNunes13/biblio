<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../models/user_address.php';

  $database = new Database();
  $db = $database->getConnection();

  $user_address = new UserAddress($db);

  $addresses = json_decode(file_get_contents("php://input"));

  $arr = array();

  foreach ($addresses as $address) {
    if (
      !empty($address->user_id) &&
      !empty($address->zip_code) &&
      !empty($address->street) &&
      !empty($address->number) &&
      !empty($address->neighborhood) &&
      !empty($address->city) &&
      !empty($address->uf)
    ) {
      $user_address->user_id = $address->user_id;
      $user_address->zip_code = $address->zip_code;
      $user_address->street = $address->street;
      $user_address->number = $address->number;
      $user_address->additional = !empty($address->additional) ? $address->additional : null;
      $user_address->neighborhood = $address->neighborhood;
      $user_address->city = $address->city;
      $user_address->uf = $address->uf;
  
      $resp = $user_address->create();

      array_push($arr, $resp);
    } else {
      continue;
    }
  }

  http_response_code(200);
  echo json_encode($arr);
?>