<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: access");
  header("Access-Control-Allow-Methods: DELETE");
  header("Access-Control-Allow-Credentials: true");
  header('Content-Type: application/json');
  
  include_once '../config/database.php';
  include_once '../models/user_phone.php';
  
  $database = new Database();
  $db = $database->getConnection();
  $user_phone = new UserPhone($db);
  
  $user_phone->id = isset($_GET['id']) ? $_GET['id'] : die();
  
  $resp = $user_phone->deleteById();
  
  if ($resp["success"]) {
    http_response_code($resp["code"]);
    echo json_encode($resp["message"]);
  } else {
    http_response_code($resp["code"]);
    echo json_encode($resp["message"]);
  }
?>