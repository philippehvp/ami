<?php
  include_once("../common.php");

  // Lecture du paramètre
  $category = $_GET["category"];

  if ($category) {
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
    echo json_encode([]);
  }
?>