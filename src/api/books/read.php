<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");

  include_once '../config/database.php';
  include_once '../models/book.php';
  
  $database = new Database();
  $db = $database->getConnection();
  
  $book = new Book($db);

  $stmt = $book->read();
  $num = $stmt->rowCount();
  
  if ($num > 0) {
    $books_arr = array();
    $books_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
      extract($row);

      $book_item = array(
        "id" => $id,
        "title" => $title,
        "author" => $author,
        "genre" => $genre,
        "edition" => $edition,
        "release_year" => $release_year,
        "isbn" => $isbn,
        "active" => $active,
        "internal_identification" => $internal_identification,
        "number_pages" => $number_pages,
        "quantity" => $quantity,
        "publishing_company_id" => $publishing_company_id,
        "created_at" => $created_at,
        "updated_at" => $updated_at
      );

      array_push($books_arr["records"], $book_item);
    }

    http_response_code(200);
    echo json_encode($books_arr);
  } else {
    http_response_code(404);

    echo json_encode(
      array("message" => "No books found.")
    );
  }
?>