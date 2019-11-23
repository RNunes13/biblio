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

  $data = json_decode(file_get_contents("php://input"));

  if (
    !empty($data->user_id) &&
    !empty($data->zip_code) &&
    !empty($data->street) &&
    !empty($data->number) &&
    !empty($data->neighborhood) &&
    !empty($data->city) &&
    !empty($data->uf)
  ) {
    $user_address->user_id = $data->user_id;
    $user_address->zip_code = $data->zip_code;
    $user_address->street = $data->street;
    $user_address->number = $data->number;
    $user_address->additional = !empty($data->additional) ? $data->additional : null;
    $user_address->neighborhood = $data->neighborhood;
    $user_address->city = $data->city;
    $user_address->uf = $data->uf;

    $resp = $user_address->create();

    http_response_code($resp["code"]);
    echo json_encode($resp["data"]);
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to updated user_address. Data is incomplete."));
  }
?>