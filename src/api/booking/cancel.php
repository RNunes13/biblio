<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: access");
  header("Access-Control-Allow-Methods: PUT");
  header("Access-Control-Allow-Credentials: true");
  header('Content-Type: application/json');
  
  include_once '../config/database.php';
  include_once '../models/booking.php';
  
  $database = new Database();
  $db = $database->getConnection();
  $booking = new Booking($db);

  $data = json_decode(file_get_contents("php://input"));

  if (!empty($data->id)) {
    $resp = $booking->cancel($data->id);
  
    if ($resp != null) {
      http_response_code(200);
      echo json_encode($resp);
    } else {
      http_response_code(404);
      echo json_encode(array("message" => "Booking does not exist."));
    }
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to canceled booking, ID was not provided."));
  }
?>