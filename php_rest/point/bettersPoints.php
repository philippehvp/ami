<?php
  include_once("../common.php");

    // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $category = json_decode($data["category"]) ? json_decode($data["category"]) : $data["category"];

  if ($accessKey && $category) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT      better.name, better.firstName, point.points" .
        " FROM        better" .
        " JOIN        point" .
        "             ON    better.id = point.better_id" .
        " WHERE       point.category_id = ?" .
        "             AND   better.isAdmin <> 1";

      $req = $db->prepare($query);
      $req->execute(array($category));
      $res = $req->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($res, JSON_NUMERIC_CHECK);
    } else {
      echo returnIsOffline();
    }
  } else {
    echo json_encode([]);
  }
?>