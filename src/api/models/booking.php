<?php
  class Booking {
    // DB connection and table name
    private $conn;
    private $table_name = "booking_history";

    // Attibutes
    public $id;
    public $book_id;
    public $user_id;
    public $reservation_date;
    public $status;
    public $updated_at;

    public function __construct($db){
      $this->conn = $db;
    }

    public function reserve($book_id, $user_id) {
      $query = "INSERT INTO " . $this->table_name . " (book_id, user_id) VALUES (:book_id, :user_id)";
   
      $stmt = $this->conn->prepare($query);

      // sanitize
      $book_id = htmlspecialchars(strip_tags($book_id));
      $user_id = htmlspecialchars(strip_tags($user_id));

      // bind values
      $stmt->bindParam(":book_id", $book_id);
      $stmt->bindParam(":user_id", $user_id);

      if ($stmt->execute()) {
        return array("success" => true, "booking_id" => (int)$this->conn->lastInsertId());
      } else {
        return array("success" => false, "message" => $stmt->errorInfo());
      }
    }
  }
?>