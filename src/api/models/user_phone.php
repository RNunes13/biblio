<?php
  class UserPhone {
    // DB connection and table name
    private $conn;
    private $table_name = "user_phone";

    // Attibutes
    public $id;
    public $ddd;
    public $number;
    public $user_id;
    public $created_at;
    public $updated_at;

    public function __construct($db){
      $this->conn = $db;
    }

    function getByUser() {
      $query = "SELECT * FROM " . $this->table_name . " WHERE user_id = ?";
   
      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(1, $this->user_id);
      $stmt->execute();
   
      $num = $stmt->rowCount();

      if ($num > 0) {
        $user_phone_arr = array();
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
          extract($row);
    
          $user_phone_item = array(
            "id" => $id,
            "ddd" => $ddd,
            "number" => $number,
            "created_at" => $created_at,
            "updated_at" => $updated_at
          );
    
          array_push($user_phone_arr, $user_phone_item);
        }
    
        return $user_phone_arr;
      } else {
        return array();
      }
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
            "message" => "UserPhone does not found with id = ".$this->id
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
      $query = "UPDATE " . $this->table_name . " SET ddd = :ddd, number = :number WHERE id = :id";

      $stmt = $this->conn->prepare($query);
      $stmt->bindParam('ddd', $this->ddd);
      $stmt->bindParam('number', $this->number);
      $stmt->bindParam('id', $this->id);
      
      if ($stmt->execute()) {
        $num = $stmt->rowCount();

        if ($num) {
          return array(
            "code" => 200,
            "data" => array(
              "success" => true,
              "message" => "UserPhone updated"
            )
          );
        } else {
          return array(
            "code" => 404,
            "data" => array(
              "success" => false,
              "message" => "UserPhone does not found with id ".$this->id
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

    function create() {
      $query = "INSERT INTO " . $this->table_name . " (ddd, number, user_id) VALUES (:ddd, :number, :user_id)";

      $stmt = $this->conn->prepare($query);
      $stmt->bindParam('ddd', $this->ddd);
      $stmt->bindParam('number', $this->number);
      $stmt->bindParam('user_id', $this->user_id);
      
      if ($stmt->execute()) {
        return array(
          "code" => 201,
          "data" => array(
            "success" => true,
            "message" => "UserPhone created"
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