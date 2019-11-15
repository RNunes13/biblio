<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: POST");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  
  include_once '../config/database.php';
  include_once '../models/book.php';
  
  $database = new Database();
  $db = $database->getConnection();
  
  $book = new Book($db);
  
  $data = json_decode(file_get_contents("php://input"));
  
  if (
    !empty($data->title) &&
    !empty($data->author) &&
    !empty($data->isbn) &&
    !empty($data->quantity) &&
    !empty($data->publishing_company_id)
  ) {
    $book->title = $data->title;
    $book->author = $data->author;
    $book->genre = $data->genre;
    $book->edition = $data->edition;
    $book->release_year = $data->release_year;
    $book->isbn = $data->isbn;
    $book->internal_identification = $data->internal_identification;
    $book->number_pages = $data->number_pages;
    $book->quantity = $data->quantity;
    $book->publishing_company_id = $data->publishing_company_id;
    $book->thumbnail = $data->thumbnail;

    $resp = $book->create();

    if ($resp["success"]) {
      http_response_code(201);
      echo json_encode(array("message" => "Book was created."));
    } else {
      http_response_code(503);
      echo json_encode(array("message" => $resp["message"]));
    }
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create book. Data is incomplete."));
  }
?>