<?php
  include_once("../common.php");

    // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $category = json_decode($data["category"]) ? json_decode($data["category"]) : $data["category"];

  if ($accessKey && $category) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT      cpi_better.name, cpi_better.firstName, cpi_point.points" .
        " FROM        cpi_better" .
        " JOIN        cpi_point" .
        "             ON    cpi_better.id = cpi_point.better_id" .
        " WHERE       cpi_point.category_id = ?" .
        "             AND   cpi_better.isAdmin <> 1" .
        " ORDER BY    cpi_better.name, cpi_better.firstName, cpi_better.id";

      $req = $db->prepare($query);
      $req->execute(array($category));
      $res = $req->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($res, JSON_NUMERIC_CHECK);
    } else {
      echo returnIsOffline();
    }
  } else {
    echo returnIsOffline();
  }
?>