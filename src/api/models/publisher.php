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
  }
?>