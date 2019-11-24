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

    function readOne($booking_id) {
      $query = "SELECT
                  bh.*,
                  book.id AS 'book_id',
                  book.title AS 'book_title',
                  book.author AS 'book_author',
                  book.genre AS 'book_genre',
                  book.edition AS 'book_edition',
                  book.release_year AS 'book_release_year',
                  book.isbn AS 'book_isbn',
                  book.active AS 'book_active',
                  book.internal_identification AS 'book_internal_identification',
                  book.number_pages AS 'book_number_pages',
                  book.quantity AS 'book_quantity',
                  book.publishing_company_id AS 'book_publishing_company_id',
                  book.thumbnail AS 'book_thumbnail',
                  book.created_at AS 'book_created_at',
                  book.updated_at AS 'book_updated_at',
                  user.id AS 'user_id',
                  user.name AS 'user_name',
                  user.username AS 'user_username',
                  user.email AS 'user_email',
                  user.role_id AS 'user_role_id',
                  user.created_at AS 'user_created_at',
                  user.updated_at AS 'user_updated_at'
                FROM " . $this->table_name . " AS bh
                JOIN user ON user.id = bh.user_id
                JOIN book ON book.id = bh.book_id
                WHERE bh.id = ? LIMIT 0,1";

      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(1, $booking_id);
      $stmt->execute();

      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($row) {
        extract($row);

        $setting_query = "SELECT loan_days, collection_days FROM setting WHERE id = 1";

        $db = $this->conn->prepare($setting_query);
        $db->execute();

        $setting = $db->fetch(PDO::FETCH_ASSOC);

        return array(
          "id" => $id,
          "reservation_date" => $reservation_date,
          "status" => $status,
          "updated_at" => $updated_at,
          "loan_days" => $setting['loan_days'],
          "collection_days" => $setting['collection_days'],
          "book" => array(
            "id" => $book_id,
            "title" => $book_title,
            "author" => $book_author,
            "genre" => $book_genre,
            "edition" => $book_edition,
            "release_year" => $book_release_year,
            "isbn" => $book_isbn,
            "active" => $book_active,
            "internal_identification" => $book_internal_identification,
            "number_pages" => $book_number_pages,
            "quantity" => $book_quantity,
            "publishing_company_id" => $book_publishing_company_id,
            "thumbnail" => $book_thumbnail,
            "created_at" => $book_created_at,
            "updated_at" => $book_updated_at
          ),
          "user" => array(
            "id" => $user_id,
            "name" => $user_name,
            "username" => $user_username,
            "email" => $user_email,
            "role_id" => $user_role_id,
            "created_at" => $user_created_at,
            "updated_at" => $user_updated_at
          )
        );
      } else {
        return null;
      }
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

    function getByUser() {
      $query = "SELECT bh.*, book.title AS 'book_title' FROM " . $this->table_name . " AS bh JOIN book ON book.id = bh.book_id WHERE user_id = ?";
   
      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(1, $this->user_id);
      $stmt->execute();
   
      $num = $stmt->rowCount();

      if ($num > 0) {
        $booking_arr = array();
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
          extract($row);
    
          $booking_item = array(
            "id" => $id,
            "status" => $status,
            "book" => $book_title,
            "reservation_date" => $reservation_date,
          );
    
          array_push($booking_arr, $booking_item);
        }
    
        return $booking_arr;
      } else {
        return array();
      }
    }

    function cancel($booking_id) {
      $query = "UPDATE " . $this->table_name . " SET status = 'canceled' WHERE id = ?";

      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(1, $booking_id);

      if ($stmt->execute()) {
        $num = $stmt->rowCount();

        if ($num) {
          return array(
            "code" => 200,
            "data" => array(
              "success" => true,
              "message" => "Booking canceled"
            )
          );
        } else {
          return array(
            "code" => 404,
            "data" => array(
              "success" => false,
              "message" => "Booking does not found with id ".$booking_id
            )
          );
        }
      } else {
        return array(
          "code" => 500,
          "data" => array(
            "success" => false,
            "message" => $stmt->errorInfo()
          )
        );
      }
    }

    function read() {
      $query = "
        SELECT
          bh.*,
          book.title AS 'book_title',
          user.name AS 'user_name'
        FROM " . $this->table_name . " AS bh
        JOIN book ON book.id = bh.book_id
        JOIN user ON user.id = bh.user_id
      ";
   
      $stmt = $this->conn->prepare($query);
      $stmt->execute();

      $num = $stmt->rowCount();

      if ($num > 0) {
        $booking_arr = array();
        $booking_arr["records"] = array();
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
          extract($row);
    
          $booking_item = array(
            "id" => $id,
            "status" => $status,
            "book_id" => $book_id,
            "book" => $book_title,
            "user_id" => $user_id,
            "user" => $user_name,
            "reservation_date" => $reservation_date,
          );
    
          array_push($booking_arr["records"], $booking_item);
        }
    
        return $booking_arr;
      } else {
        return array();
      }
    }

    function release($booking_id) {
      $query = "UPDATE " . $this->table_name . " SET status = 'completed' WHERE id = ?";

      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(1, $booking_id);

      if ($stmt->execute()) {
        $num = $stmt->rowCount();

        if ($num) {
          return array(
            "code" => 200,
            "data" => array(
              "success" => true,
              "message" => "Booking released"
            )
          );
        } else {
          return array(
            "code" => 404,
            "data" => array(
              "success" => false,
              "message" => "Booking does not found with id ".$booking_id
            )
          );
        }
      } else {
        return array(
          "code" => 500,
          "data" => array(
            "success" => false,
            "message" => $stmt->errorInfo()
          )
        );
      }
    }
  }
?>