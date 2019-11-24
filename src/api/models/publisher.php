<?php
  class Publisher {
    // DB connection and table name
    private $conn;
    private $table_name = "publishing_company";

    // Attibutes
    public $id;
    public $name;
    public $created_at;
    public $updated_at;

    public function __construct($db){
      $this->conn = $db;
    }

    function read() {
      $query = "SELECT * FROM " . $this->table_name;
   
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
   
      return $stmt;
    }

    function create(){
      $query = "INSERT INTO " . $this->table_name . " (name) VALUES (:name)";
   
      $stmt = $this->conn->prepare($query);
   
      // sanitize
      $this->name = htmlspecialchars(strip_tags($this->name));
      
      // bind values
      $stmt->bindParam(":name", $this->name);
   
      if ($stmt->execute()) {
        return array("success" => true);
      }

      return array("success" => false, "message" => $stmt->errorInfo());
    }

    function update() {
      $query = "UPDATE " . $this->table_name . " SET name = :name WHERE id = :id";

      $stmt = $this->conn->prepare($query);

      // sanitize
      $this->id = htmlspecialchars(strip_tags($this->id));
      $this->name = htmlspecialchars(strip_tags($this->name));

      // bind values
      $stmt->bindParam(":id", $this->id);
      $stmt->bindParam(":name", $this->name);

      if ($stmt->execute()) {
        return array(
          "code" => 200,
          "data" => array(
            "success" => true,
            "message" => "Publisher updated"
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
            "message" => "Publisher does not found with id = ".$this->id
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