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
    !empty($data->title) ||
    !empty($data->author) ||
    !empty($data->genre) ||
    !empty($data->publishing_company_id)
  ) {
    $title = !empty($data->title) ? $data->title : '';
    $author = !empty($data->author) ? $data->author : '';
    $genre = !empty($data->genre) ? $data->genre : '';
    $publishing_company_id = !empty($data->publishing_company_id) ? $data->publishing_company_id : '';
  
    $books = $book->search($title, $author, $genre, $publishing_company_id);
  
    http_response_code(200);
    echo json_encode($books);
  } else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to search for book. Data is incomplete.")); 
  }
?>