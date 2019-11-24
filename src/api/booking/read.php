<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");

  include_once '../config/database.php';
  include_once '../models/booking.php';
  
  $database = new Database();
  $db = $database->getConnection();
  
  $booking = new Booking($db);

  $resp = $booking->read();
  
  http_response_code(200);
  echo json_encode($resp);
?>