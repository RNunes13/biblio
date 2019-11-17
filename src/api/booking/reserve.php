<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
  include_once '../config/database.php';
  include_once '../models/booking.php';
  
  $database = new Database();
  $db = $database->getConnection();
  
  $booking = new Booking($db);
  
  $data = json_decode(file_get_contents("php://input"));

  if (!empty($data->book_id) || !empty($data->user_id)) {
    $resp = $booking->reserve($data->book_id, $data->user_id);

    if ($resp["success"]) {
      http_response_code(201);
      echo json_encode($resp);
    } else {
      http_response_code(503);
      echo json_encode($resp);
    }
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create booking. Data is incomplete."));
  }
?>