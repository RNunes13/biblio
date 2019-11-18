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
      $query = "SELECT book.*, pc.name AS 'publisher_name' FROM " . $this->table_name . " JOIN publishing_company AS pc ON pc.id = book.publishing_company_id";
   
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

    function readOne() {
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

    function search($title, $author, $genre, $publishing_company_id) {
      // sanitize
      $title = htmlspecialchars(strip_tags($title));
      $author = htmlspecialchars(strip_tags($author));
      $genre = htmlspecialchars(strip_tags($genre));
      $publisher = htmlspecialchars(strip_tags($publishing_company_id));

      $condition = [];

      if (!empty($title)) array_push($condition, count($condition) == 0 ? "title LIKE '%" . $title . "%'" : "OR title LIKE '%" . $title . "%'");
      if (!empty($author)) array_push($condition, count($condition) == 0 ? "author LIKE '%" . $author . "%'" : "OR author LIKE '%" . $author . "%'");
      if (!empty($genre)) array_push($condition, count($condition) == 0 ? "genre LIKE '%" . $genre . "%'" : "OR genre LIKE '%" . $genre . "%'");
      if (!empty($publisher)) array_push($condition, count($condition) == 0 ? "publishing_company_id = " . $publisher : "OR publishing_company_id = " . $publisher);

      $query = "SELECT * FROM " . $this->table_name . " WHERE " . join(" ", $condition);
   
      $stmt = $this->conn->prepare( $query );

      $stmt->execute();

      $num = $stmt->rowCount();
  
      $books_arr = array();
      $books_arr["records"] = array();

      while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);

        $book_item = array(
          "id" => $id,
          "title" => $title,
          "author" => $author,
          "genre" => $genre,
          "edition" => $edition,
          "release_year" => $release_year,
          "isbn" => $isbn,
          "active" => $active,
          "internal_identification" => $internal_identification,
          "number_pages" => $number_pages,
          "quantity" => $quantity,
          "publishing_company_id" => $publishing_company_id,
          "thumbnail" => $thumbnail,
          "created_at" => $created_at,
          "updated_at" => $updated_at
        );

        array_push($books_arr["records"], $book_item);
      }

      return $books_arr;
    }
  }
?>