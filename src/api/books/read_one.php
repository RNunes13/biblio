<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Headers: access");
  header("Access-Control-Allow-Methods: GET");
  header("Access-Control-Allow-Credentials: true");
  header('Content-Type: application/json');
  
  include_once '../config/database.php';
  include_once '../models/book.php';
  
  $database = new Database();
  $db = $database->getConnection();
  $book = new Book($db);
  
  $book->id = isset($_GET['id']) ? $_GET['id'] : die();
  
  $book->readOne();
  
  if ($book->id != null) {
      $book_arr = array(
        "id" => $book->id,
        "title" => $book->title,
        "author" => $book->author,
        "genre" => $book->genre,
        "edition" => $book->edition,
        "release_year" => $book->release_year,
        "isbn" => $book->isbn,
        "active" => $book->active,
        "internal_identification" => $book->internal_identification,
        "number_pages" => $book->number_pages,
        "quantity" => $book->quantity,
        "publishing_company_id" => $book->publishing_company_id,
        "thumbnail" => $book->thumbnail,
        "created_at" => $book->created_at,
        "updated_at" =>$book->updated_at
      );
  
      http_response_code(200);
      echo json_encode($book_arr);
  } else {
    http_response_code(404);
    echo json_encode(array("message" => "Book does not exist."));
  }
?>