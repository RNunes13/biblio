<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: access");
  header("Access-Control-Allow-Methods: PUT");
  header("Access-Control-Allow-Credentials: true");
  header('Content-Type: application/json');
  
  include_once '../config/database.php';
  include_once '../models/book_loan.php';

  $database = new Database();
  $db = $database->getConnection();
  $book_loan = new BookLoan($db);

  $data = json_decode(file_get_contents("php://input"));

  if (!empty($data->id)) {
    $resp = $book_loan->renew($data->id);
  
    http_response_code($resp['code']);
    echo json_encode($resp['data']);
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to renew book_loan, ID was not provided."));
  }
?>