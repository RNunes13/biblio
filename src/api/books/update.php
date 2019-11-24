<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
  header("Access-Control-Allow-Methods: PUT");
  header("Access-Control-Max-Age: 3600");
  header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

  include_once '../config/database.php';
  include_once '../models/book.php';

  $database = new Database();
  $db = $database->getConnection();

  $book = new Book($db);

  $data = json_decode(file_get_contents("php://input"));

  if (
    !empty($data->id) &&
    !empty($data->title) &&
    !empty($data->author) &&
    !empty($data->isbn) &&
    !empty($data->quantity) &&
    !empty($data->publishing_company_id)
  ) {
    $book->id = $data->id;
    $book->title = $data->title;
    $book->author = $data->author;
    $book->genre = $data->genre;
    $book->edition = $data->edition;
    $book->release_year = $data->release_year;
    $book->isbn = $data->isbn;
    $book->active = $data->active;
    $book->internal_identification = $data->internal_identification;
    $book->number_pages = !empty($data->number_pages) ? $data->number_pages : 0;
    $book->quantity = $data->quantity;
    $book->publishing_company_id = $data->publishing_company_id;
    $book->thumbnail = $data->thumbnail;

    $resp = $book->update();

    http_response_code($resp["code"]);
    echo json_encode($resp["data"]);
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to updated book. Data is incomplete."));
  }
?>