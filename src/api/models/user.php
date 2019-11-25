<?php
  class User {
    // DB connection and table name
    private $conn;
    private $table_name = "user";

    // Attibutes
    public $id;
    public $name;
    public $username;
    public $email;
    public $password;
    public $cpf;
    public $rg;
    public $role_id;
    public $created_at;
    public $updated_at;
    public $deleted;

    public function __construct($db){
      $this->conn = $db;
    }

    private function randomPassword($length, $count, $characters) {
      $symbols = array();
      $passwords = array();
      $used_symbols = '';
      $pass = '';

      $symbols["lower_case"] = 'abcdefghijklmnopqrstuvwxyz';
      $symbols["upper_case"] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      $symbols["numbers"] = '1234567890';
      $symbols["special_symbols"] = '!?~@#-_+<>[]{}';
  
      $characters = explode(",", $characters);

      foreach ($characters as $key=>$value) {
        $used_symbols .= $symbols[$value];
      }

      $symbols_length = strlen($used_symbols) - 1;
  
      for ($p = 0; $p < $count; $p++) {
        $pass = '';

        for ($i = 0; $i < $length; $i++) {
          $n = rand(0, $symbols_length);
          $pass .= $used_symbols[$n];
        }

        $passwords[] = $pass;
      }
  
      return $passwords;
    }

    public function login($username, $password) {
      $password_hash = md5($password);

      $query = "SELECT * FROM " . $this->table_name . " WHERE username = :username AND password = :password AND deleted = false";
   
      $stmt = $this->conn->prepare($query);

      // sanitize
      $username = htmlspecialchars(strip_tags($username));

      // bind values
      $stmt->bindParam("username", $username);
      $stmt->bindParam("password", $password_hash);

      $stmt->execute();

      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        extract($result);

        $picture = "http://www.gravatar.com/avatar/" . md5($email) . ".jpg?s=80&d=identicon";

        $user = array(
          "id" => $id,
          "cpf" => $cpf,
          "name" => $name,
          "email" => $email,
          "role" => $role_id,
          "picture" => $picture,
          "username" => $username,
          "created_at" => $created_at,
          "updated_at" => $updated_at,
        );

        return array("success" => true, "user" => $user);
      } else {
        return array(
          "success" => false,
          "error" => array(
            "code" => "@Biblio:InvalidCredentials",
            "message" => "Invalid credentials."
          )
        );
      }
    }

    public function checkUsername($username, $usernameUser) {
      $query = empty($usernameUser) ?
        "SELECT * FROM " . $this->table_name . " WHERE username = :username AND deleted = false" :
        "SELECT * FROM " . $this->table_name . " WHERE username = :username AND username != :username_user AND deleted = false";
   
      $stmt = $this->conn->prepare($query);
      
      // sanitize
      $username = htmlspecialchars(strip_tags($username));
      $usernameUser = htmlspecialchars(strip_tags($usernameUser));
      
      // bind values
      $stmt->bindParam(":username", $username);
      !empty($usernameUser) && $stmt->bindParam(":username_user", $usernameUser);

      $stmt->execute();

      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        return array("success" => true, "available" => false);
      } else {
        return array("success" => true, "available" => true);
      }
    }

    public function updatePassword($userId, $current, $new) {
      $current_hash = md5($current);
      $new_hash = md5($new);

      $check_password = "SELECT * FROM " . $this->table_name . " WHERE id = :id AND deleted = false";
   
      $stmt = $this->conn->prepare($check_password);

      // sanitize
      $userId = htmlspecialchars(strip_tags($userId));

      // bind values
      $stmt->bindParam(":id", $userId);

      $stmt->execute();

      $result = $stmt->fetch(PDO::FETCH_ASSOC);

      if ($result) {
        extract($result);

        if ($password != $current_hash) {
          return array(
            "success" => false,
            "error" => array(
              "code" => "@Biblio:incorrectPassword",
              "message" => "Current password does not match user password."
            )
          );
        }

        if ($password == $new_hash) {
          return array(
            "success" => false,
            "error" => array(
              "code" => "@Biblio:newPasswordSameAsCurrentPassword",
              "message" => "New password equals current password."
            )
          );
        }

        $query = "UPDATE " . $this->table_name . " SET password = :new_password WHERE id = :id";

        $statement = $this->conn->prepare($query);

        // bind values
        $statement->bindParam(":id", $userId);
        $statement->bindParam(":new_password", $new_hash);

        if ($statement->execute()) {
          return array("success" => true);
        } else {
          return array(
            "success" => false,
            "error" => array(
              "code" => "@Biblio:passwordUpdateError",
              "message" => $stmt->errorInfo()
            )
          );
        }
      } else {
        return array(
          "success" => false,
          "error" => array(
            "code" => "@Biblio:userNotFound",
            "message" => "User not found."
          )
        );
      }
    }

    function update() {
      $query = "
        UPDATE " . $this->table_name . " 
        SET name = :name, username = :username, email = :email, cpf = :cpf 
        WHERE id = :id
      ";

      $stmt = $this->conn->prepare($query);
      $stmt->bindParam('id', $this->id);
      $stmt->bindParam('name', $this->name);
      $stmt->bindParam('username', $this->username);
      $stmt->bindParam('email', $this->email);
      $stmt->bindParam('cpf', $this->cpf);
      
      if ($stmt->execute()) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
 
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam("id", $this->id);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        extract($result);

        $user = array(
          "id" => $id,
          "cpf" => $cpf,
          "name" => $name,
          "email" => $email,
          "role" => $role_id,
          "picture" => "http://www.gravatar.com/avatar/" . md5($email) . ".jpg?s=80&d=identicon",
          "username" => $username,
          "created_at" => $created_at,
          "updated_at" => $updated_at,
        );

        return array(
          "code" => 200,
          "data" => $user
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
      $query = "SELECT * FROM " . $this->table_name;

      $stmt = $this->conn->prepare($query);
      $stmt->execute();

      $num = $stmt->rowCount();

      if ($num > 0) {
        $user_arr = array();
        $user_arr["records"] = array();
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
          extract($row);
    
          $user_item = array(
            "id" => $id,
            "cpf" => $cpf,
            "name" => $name,
            "email" => $email,
            "role" => $role_id,
            "deleted" => $deleted == '1' ? true : false,
            "username" => $username,
            "created_at" => $created_at,
            "updated_at" => $updated_at,
          );
    
          array_push($user_arr["records"], $user_item);
        }
    
        return $user_arr;
      } else {
        return array();
      }
    }

    function admin_update() {
      $query = "
        UPDATE " . $this->table_name . " 
        SET name = :name, username = :username, email = :email, cpf = :cpf, role_id = :role_id, deleted = :deleted 
        WHERE id = :id
      ";

      $this->deleted = $this->deleted ? '1' : '0';

      $stmt = $this->conn->prepare($query);
      $stmt->bindParam('id', $this->id);
      $stmt->bindParam('name', $this->name);
      $stmt->bindParam('username', $this->username);
      $stmt->bindParam('email', $this->email);
      $stmt->bindParam('cpf', $this->cpf);
      $stmt->bindParam('role_id', $this->role_id);
      $stmt->bindParam('deleted', $this->deleted);
      
      if ($stmt->execute()) {
        return array(
          "code" => 200,
          "message" => "User updated"
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

    function admin_create() {
      $query = "
        INSERT INTO " . $this->table_name . " (name, username, email, cpf, password, role_id, deleted)
        VALUES (:name, :username, :email, :cpf, :password, :role_id, :deleted) 
      ";

      $this->deleted = $this->deleted ? '1' : '0';

      $password = '@Biblio:123Mudar';

      $password_hash = md5($password);

      $stmt = $this->conn->prepare($query);
      $stmt->bindParam(':name', $this->name);
      $stmt->bindParam(':username', $this->username);
      $stmt->bindParam(':email', $this->email);
      $stmt->bindParam(':cpf', $this->cpf);
      $stmt->bindParam(':password', $password_hash);
      $stmt->bindParam(':role_id', $this->role_id);
      $stmt->bindParam(':deleted', $this->deleted);
      
      if ($stmt->execute()) {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id DESC LIMIT 1";
 
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        extract($result);

        $user = array(
          "id" => $id,
          "cpf" => $cpf,
          "name" => $name,
          "email" => $email,
          "role" => $role_id,
          "picture" => "http://www.gravatar.com/avatar/" . md5($email) . ".jpg?s=80&d=identicon",
          "username" => $username,
          "created_at" => $created_at,
          "updated_at" => $updated_at,
        );

        return array(
          "success" => true,
          "data" => $user
        );
      } else {
        return array(
          "success" => false,
          "message" => $stmt->errorInfo()
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
            "message" => "Book does not found with id = ".$this->id
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

    function create() {
      $insert = "
        INSERT INTO " . $this->table_name . " (name, username, email, password, role_id, deleted)
        VALUES (:name, :username, :email, :password, 4, false) 
      ";

      $password_hash = md5($this->password);

      $stmt = $this->conn->prepare($insert);
      $stmt->bindParam(':name', $this->name);
      $stmt->bindParam(':username', $this->username);
      $stmt->bindParam(':email', $this->email);
      $stmt->bindParam(':password', $password_hash);

      if ($stmt->execute()) {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id DESC LIMIT 1";
 
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        extract($result);

        $user = array(
          "id" => $id,
          "cpf" => $cpf,
          "name" => $name,
          "email" => $email,
          "role" => $role_id,
          "picture" => "http://www.gravatar.com/avatar/" . md5($email) . ".jpg?s=80&d=identicon",
          "username" => $username,
          "created_at" => $created_at,
          "updated_at" => $updated_at,
        );

        return array(
          "success" => true,
          "data" => $user
        );
      } else {
        return array(
          "success" => false,
          "message" => $stmt->errorInfo()
        );
      }
    }
  }
?>