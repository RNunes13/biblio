<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: access");
  header("Access-Control-Allow-Methods: GET");
  header("Access-Control-Allow-Credentials: true");
  header('Content-Type: application/json');
  
  include_once '../config/database.php';
  include_once '../models/booking.php';
  
  $database = new Database();
  $db = $database->getConnection();
  $booking = new Booking($db);
  
  $booking_id = isset($_GET['id']) ? $_GET['id'] : die();
  
  $resp = $booking->readOne($booking_id);
  
  if ($resp != null) {
    http_response_code(200);
    echo json_encode($resp);
  } else {
    http_response_code(404);
    echo json_encode(array("message" => "Booking does not exist."));
  }
?>