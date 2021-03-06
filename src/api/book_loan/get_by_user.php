<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: access");
  header("Access-Control-Allow-Methods: GET");
  header("Access-Control-Allow-Credentials: true");
  header('Content-Type: application/json');
  
  include_once '../config/database.php';
  include_once '../models/book_loan.php';
  
  $database = new Database();
  $db = $database->getConnection();
  $book_loan = new BookLoan($db);

  $book_loan->user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

  $resp = $book_loan->getByUser();

  http_response_code(200);
  echo json_encode($resp);
?>