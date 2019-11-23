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
  }
?>