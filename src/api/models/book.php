<?php
  class Book {
    // DB connection and table name
    private $conn;
    private $table_name = "book";

    // Attibutes
    public $id;
    public $title;
    public $author;
    public $genre;
    public $edition;
    public $release_year;
    public $isbn;
    public $active;
    public $internal_identification;
    public $number_pages;
    public $quantity;
    public $publishing_company_id;
    public $thumbnail;
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
      $query = "INSERT INTO " . $this->table_name . " (title, author, genre, edition, release_year, isbn, internal_identification, number_pages, quantity, publishing_company_id)
                VALUES (:title, :author, :genre, :edition, :release_year, :isbn, :internal_identification, :number_pages, :quantity, :publishing_company_id)";
   
      $stmt = $this->conn->prepare($query);
   
      // sanitize
      $this->title = htmlspecialchars(strip_tags($this->title));
      $this->author = htmlspecialchars(strip_tags($this->author));
      $this->genre = htmlspecialchars(strip_tags($this->genre));
      $this->edition = htmlspecialchars(strip_tags($this->edition));
      $this->release_year = htmlspecialchars(strip_tags($this->release_year));
      $this->isbn = htmlspecialchars(strip_tags($this->isbn));
      $this->internal_identification = htmlspecialchars(strip_tags($this->internal_identification));
      $this->number_pages = htmlspecialchars(strip_tags($this->number_pages));
      $this->quantity = htmlspecialchars(strip_tags($this->quantity));
      $this->publishing_company_id = htmlspecialchars(strip_tags($this->publishing_company_id));
      
      // bind values
      $stmt->bindParam(":title", $this->title);
      $stmt->bindParam(":author", $this->author);
      $stmt->bindParam(":genre", $this->genre);
      $stmt->bindParam(":edition", $this->edition);
      $stmt->bindParam(":release_year", $this->release_year);
      $stmt->bindParam(":isbn", $this->isbn);
      $stmt->bindParam(":internal_identification", $this->internal_identification);
      $stmt->bindParam(":number_pages", $this->number_pages);
      $stmt->bindParam(":quantity", $this->quantity);
      $stmt->bindParam(":publishing_company_id", $this->publishing_company_id);
   
      if ($stmt->execute()) {
        return array("success" => true);
      }

      return array("success" => false, "message" => $stmt->errorInfo());
    }

    function readOne(){
      $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";

      $stmt = $this->conn->prepare( $query );
      $stmt->bindParam(1, $this->id);
      $stmt->execute();

      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      $this->id = $row['id'];
      $this->title = $row['title'];
      $this->author = $row['author'];
      $this->genre = $row['genre'];
      $this->edition = $row['edition'];
      $this->release_year = $row['release_year'];
      $this->isbn = $row['isbn'];
      $this->active = $row['active'];
      $this->internal_identification = $row['internal_identification'];
      $this->number_pages = $row['number_pages'];
      $this->quantity = $row['quantity'];
      $this->publishing_company_id = $row['publishing_company_id'];
      $this->created_at = $row['created_at'];
      $this->updated_at = $row['updated_at'];
    }
  }
?>