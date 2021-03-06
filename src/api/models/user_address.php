<?php
  class UserAddress {
    // DB connection and table name
    private $conn;
    private $table_name = "user_address";

    // Attibutes
    public $id;
    public $user_id;
    public $zip_code;
    public $street;
    public $number;
    public $additional;
    public $neighborhood;
    public $city;
    public $uf;
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
        $user_address_arr = array();
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
          extract($row);
    
          $user_address_item = array(
            "id" => $id,
            "user_id" => $user_id,
            "zip_code" => $zip_code,
            "street" => $street,
            "number" => $number,
            "additional" => $additional,
            "neighborhood" => $neighborhood,
            "city" => $city,
            "uf" => $uf,
            "created_at" => $created_at,
            "updated_at" => $updated_at
          );
    
          array_push($user_address_arr, $user_address_item);
        }
    
        return $user_address_arr;
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
            "message" => "UserAddress does not found with id = ".$this->id
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
      $query = "
        UPDATE " . $this->table_name . " SET
          zip_code = :zip_code,
          street = :street,
          number = :number,
          additional = :additional,
          neighborhood = :neighborhood,
          city = :city,
          uf = :uf
        WHERE id = :id
      ";

      $stmt = $this->conn->prepare($query);
      $stmt->bindParam('zip_code', $this->zip_code);
      $stmt->bindParam('street', $this->street);
      $stmt->bindParam('number', $this->number);
      $stmt->bindParam('additional', $this->additional);
      $stmt->bindParam('neighborhood', $this->neighborhood);
      $stmt->bindParam('city', $this->city);
      $stmt->bindParam('uf', $this->uf);
      $stmt->bindParam('id', $this->id);
      
      if ($stmt->execute()) {
        $num = $stmt->rowCount();

        if ($num) {
          return array(
            "code" => 200,
            "data" => array(
              "success" => true,
              "message" => "UserAddress updated"
            )
          );
        } else {
          return array(
            "code" => 404,
            "data" => array(
              "success" => false,
              "message" => "UserAddress does not found with id ".$this->id
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
      $query = "
        INSERT INTO " . $this->table_name . " (user_id, zip_code, street, number, additional, neighborhood, city, uf) 
        VALUES (:user_id, :zip_code, :street, :number, :additional, :neighborhood, :city, :uf)
      ";

      $stmt = $this->conn->prepare($query);
      $stmt->bindParam('user_id', $this->user_id);
      $stmt->bindParam('zip_code', $this->zip_code);
      $stmt->bindParam('street', $this->street);
      $stmt->bindParam('number', $this->number);
      $stmt->bindParam('additional', $this->additional);
      $stmt->bindParam('neighborhood', $this->neighborhood);
      $stmt->bindParam('city', $this->city);
      $stmt->bindParam('uf', $this->uf);
      
      if ($stmt->execute()) {
        return array(
          "code" => 201,
          "data" => array(
            "success" => true,
            "message" => "UserAddress created"
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