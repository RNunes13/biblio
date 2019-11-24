<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: PUT");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../models/book_loan.php';

  $database = new Database();
  $db = $database->getConnection();

  $book_loan = new BookLoan($db);

  $data = json_decode(file_get_contents("php://input"));

  if (
    !empty($data->id) &&
    !empty($data->user_id) &&
    !empty($data->book_id)
  ) {
    $book_loan->id = $data->id;
    $book_loan->user_id = $data->user_id;
    $book_loan->book_id = $data->book_id;

    $resp = $book_loan->update();

    http_response_code($resp["code"]);
    echo json_encode($resp["data"]);
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to updated book_loan. Data is incomplete."));
  }
?>