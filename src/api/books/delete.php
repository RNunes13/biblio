<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: access");
  header("Access-Control-Allow-Methods: DELETE");
  header("Access-Control-Allow-Credentials: true");
  header('Content-Type: application/json');
  
  include_once '../config/database.php';
  include_once '../models/book.php';
  
  $database = new Database();
  $db = $database->getConnection();
  $book = new Book($db);
  
  $book->id = isset($_GET['id']) ? $_GET['id'] : die();
  
  $resp = $book->deleteById();
  
  if ($resp["success"]) {
    http_response_code($resp["code"]);
    echo json_encode($resp["message"]);
  } else {
    http_response_code($resp["code"]);
    echo json_encode($resp["message"]);
  }
?>