<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");

  include_once '../config/database.php';
  include_once '../models/book_loan.php';
  
  $database = new Database();
  $db = $database->getConnection();
  
  $book_loan = new BookLoan($db);

  $resp = $book_loan->read();
  
  http_response_code(200);
  echo json_encode($resp);
?>