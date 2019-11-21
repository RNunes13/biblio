<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: access");
  header("Access-Control-Allow-Methods: GET");
  header("Access-Control-Allow-Credentials: true");
  header('Content-Type: application/json');
  
  include_once '../config/database.php';
  include_once '../models/user_phone.php';
  
  $database = new Database();
  $db = $database->getConnection();
  $user_phone = new UserPhone($db);
  
  $user_phone->user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();
  
  $resp = $user_phone->getByUser();
  
  http_response_code(200);
  echo json_encode($resp);
?>