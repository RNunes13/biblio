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

    public function login($username, $password) {
      $password_hash = md5($password);

      $query = "SELECT * FROM " . $this->table_name . " WHERE username = :username AND password = :password AND deleted = false";
   
      $stmt = $this->conn->prepare($query);

      // sanitize
      $username = htmlspecialchars(strip_tags($username));

      // bind values
      $stmt->bindParam(":username", $username);
      $stmt->bindParam(":password", $password_hash);

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
  }
?>