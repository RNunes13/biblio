<?php
  class Role {
    // DB connection and table name
    private $conn;
    private $table_name = "role";

    // Attibutes
    public $id;
    public $name;
    public $description;
    public $created_at;
    public $updated_at;

    public function __construct($db){
      $this->conn = $db;
    }

    function read() {
      $query = "SELECT * FROM " . $this->table_name;

      $stmt = $this->conn->prepare($query);
      $stmt->execute();

      $num = $stmt->rowCount();

      if ($num > 0) {
        $role_arr = array();
        $role_arr["records"] = array();
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
          extract($row);
    
          $role_item = array(
            "id" => $id,
            "name" => $name,
            "description" => $description,
            "created_at" => $created_at,
            "updated_at" => $updated_at,
          );
    
          array_push($role_arr["records"], $role_item);
        }
    
        return $role_arr;
      } else {
        return array();
      }
    }
  }
?>