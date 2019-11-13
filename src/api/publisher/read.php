<?php
  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");

  include_once '../config/database.php';
  include_once '../models/publisher.php';
  
  $database = new Database();
  $db = $database->getConnection();
  
  $publisher = new Publisher($db);

  $stmt = $publisher->read();
  $num = $stmt->rowCount();
  
  if ($num > 0) {
    $publisher_arr = array();
    $publisher_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
      extract($row);

      $publisher_item = array(
        "id" => $id,
        "name" => $name,
        "created_at" => $created_at,
        "updated_at" => $updated_at
      );

      array_push($publisher_arr["records"], $publisher_item);
    }

    http_response_code(200);
    echo json_encode($publisher_arr);
  } else {
    http_response_code(404);

    echo json_encode(
      array("message" => "No publisher found.")
    );
  }
?>