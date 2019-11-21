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
        return null;
      }
    }

    function deleteById() {
      $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
   
      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(1, $this->id);
      
      if ($stmt->execute()) {
        $num = $stmt->rowCount();

        if ($num) {
          return array("success" => true, "message" => true);
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
  }
?>