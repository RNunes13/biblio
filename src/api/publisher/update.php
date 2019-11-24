<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: PUT");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../models/publisher.php';

  $database = new Database();
  $db = $database->getConnection();

  $publisher = new Publisher($db);

  $data = json_decode(file_get_contents("php://input"));

  if (
    !empty($data->id) &&
    !empty($data->name)
  ) {
    $publisher->id = $data->id;
    $publisher->name = $data->name;

    $resp = $publisher->update();

    http_response_code($resp["code"]);
    echo json_encode($resp["data"]);
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to updated publisher. Data is incomplete."));
  }
?>