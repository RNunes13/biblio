<?php
  class BookLoan {
    // DB connection and table name
    private $conn;
    private $table_name = "book_loan";

    // Attibutes
    public $id;
    public $book_id;
    public $user_id;
    public $loan_date;
    public $return_date;
    public $status;
    public $renewal_count;
    public $updated_at;

    public function __construct($db){
      $this->conn = $db;
    }

    function getSetting() {
      $setting_query = "SELECT loan_days, collection_days, renewals_allowed FROM setting WHERE id = 1";

      $db = $this->conn->prepare($setting_query);
      $db->execute();

      $setting = $db->fetch(PDO::FETCH_ASSOC);

      return $setting;
    }

    function getByUser() {
      $query = "SELECT bl.*, book.title AS 'book_title' FROM " . $this->table_name . " AS bl JOIN book ON book.id = bl.book_id WHERE user_id = ?";
   
      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(1, $this->user_id);
      $stmt->execute();
   
      $num = $stmt->rowCount();

      if ($num > 0) {
        $setting = $this->getSetting();

        $loan_arr = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
          extract($row);
    
          $end_date = date_create($loan_date);
          $days = ((int) $setting['loan_days']) * ($renewal_count + 1);
          date_add($end_date, date_interval_create_from_date_string($days." days"));

          $loan_item = array(
            "id" => $id,
            "status" => $status,
            "book" => $book_title,
            "loan_date" => $loan_date,
            "renewal_count" => $renewal_count,
            "end_date" => $end_date->format('Y-m-d H:i:s'),
            "renewals_allowed" => $setting['renewals_allowed'],
          );
    
          array_push($loan_arr, $loan_item);
        }
    
        return $loan_arr;
      } else {
        return array();
      }
    }

    function renew($loan_id) {
      $setting = $this->getSetting();

      $query = "SELECT loan_date, renewal_count FROM " . $this->table_name . " WHERE id = ?";

      $stmt_select = $this->conn->prepare($query);
      $stmt_select->bindParam(1, $loan_id);

      $stmt_select->execute();

      $loan = $stmt_select->fetch(PDO::FETCH_ASSOC);

      if (empty($loan)) {
        return array(
          "code" => 404,
          "data" => array(
            "success" => false,
            "message" => "BookLoan does not found with id ".$loan_id
          )
        );
      }

      if ($loan['renewal_count'] >= $setting['renewals_allowed']) {
        return array(
          "code" => 200,
          "data" => array(
            "success" => false,
            "error" => array(
              "code" => "@Biblio:maximumLimitReached",
              "message" => "It is no longer possible to renew this loan."
            )
          )
        );
      }

      $update = "UPDATE " . $this->table_name . " SET renewal_count = renewal_count + 1 WHERE id = ?";

      $stmt = $this->conn->prepare($update);
      $stmt->bindParam(1, $loan_id);

      if ($stmt->execute()) {
        $end_date = date_create($loan['loan_date']);
        $days = ((int) $setting['loan_days']) * ($loan['renewal_count'] + 2);
        date_add($end_date, date_interval_create_from_date_string($days." days"));

        return array(
          "code" => 200,
          "data" => array(
            "success" => true,
            "end_date" => $end_date->format('Y-m-d H:i:s'),
            "renewal_count" => $loan['renewal_count'] + 1,
          )
        );
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
          bl.*,
          book.title AS 'book_title',
          user.name AS 'user_name'
        FROM " . $this->table_name . " AS bl
        JOIN book ON book.id = bl.book_id
        JOIN user ON user.id = bl.user_id
      ";
   
      $stmt = $this->conn->prepare($query);
      $stmt->execute();

      $num = $stmt->rowCount();

      if ($num > 0) {
        $setting = $this->getSetting();
        $book_loan_arr = array();
        $book_loan_arr["records"] = array();
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
          extract($row);
    
          $end_date = date_create($loan_date);
          $days = ((int) $setting['loan_days']) * ($renewal_count + 1);
          date_add($end_date, date_interval_create_from_date_string($days." days"));

          $book_loan_item = array(
            "id" => $id,
            "status" => $status,
            "book_id" => $book_id,
            "book" => $book_title,
            "user_id" => $user_id,
            "user" => $user_name,
            "loan_date" => $loan_date,
            "renewal_count" => $renewal_count,
            "end_date" => $end_date->format('Y-m-d H:i:s'),
            "renewals_allowed" => $setting['renewals_allowed'],
          );
    
          array_push($book_loan_arr["records"], $book_loan_item);
        }
    
        return $book_loan_arr;
      } else {
        return array();
      }
    }

    function create(){
      $query = "INSERT INTO " . $this->table_name . " (user_id, book_id) VALUES (:user_id, :book_id)";
   
      $stmt = $this->conn->prepare($query);
   
      // sanitize
      $this->user_id = htmlspecialchars(strip_tags($this->user_id));
      $this->book_id = htmlspecialchars(strip_tags($this->book_id));
      
      // bind values
      $stmt->bindParam(":user_id", $this->user_id);
      $stmt->bindParam(":book_id", $this->book_id);
   
      if ($stmt->execute()) {
        return array("success" => true);
      }

      return array("success" => false, "message" => $stmt->errorInfo());
    }

    function deleteById() {
      $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
   
      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(1, $this->id);
      
      if ($stmt->execute()) {
        $num = $stmt->rowCount();

        if ($num) {
          return array("code" => 200, "success" => true, "message" => true);
        } else {
          return array(
            "code" => 404,
            "success" => false,
            "message" => "BookLoan does not found with id = ".$this->id
          );
        }
      } else {
        return array(
          "code" => 500,
          "success" => false,
          "message" => $stmt->errorInfo()
        );
      }
    }

    function update() {
      $query = "UPDATE " . $this->table_name . " SET user_id = :user_id, book_id = :book_id WHERE id = :id";

      $stmt = $this->conn->prepare($query);

      // sanitize
      $this->id = htmlspecialchars(strip_tags($this->id));
      $this->user_id = htmlspecialchars(strip_tags($this->user_id));
      $this->book_id = htmlspecialchars(strip_tags($this->book_id));

      // bind values
      $stmt->bindParam(":id", $this->id);
      $stmt->bindParam(":user_id", $this->user_id);
      $stmt->bindParam(":book_id", $this->book_id);

      if ($stmt->execute()) {
        return array(
          "code" => 200,
          "data" => array(
            "success" => true,
            "message" => "BookLoan updated"
          )
        );
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