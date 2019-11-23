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

  $data = json_decode(file_get_contents("php://input"));

  if (
    !empty($data->ddd) &&
    !empty($data->number) &&
    !empty($data->user_id)
  ) {
    $user_phone->ddd = $data->ddd;
    $user_phone->number = $data->number;
    $user_phone->user_id = $data->user_id;

    $resp = $user_phone->create();

    http_response_code($resp["code"]);
    echo json_encode($resp["data"]);
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to updated user_phone. Data is incomplete."));
  }
?>