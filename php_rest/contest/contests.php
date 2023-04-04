<?php
  include_once("../common.php");

  // Lecture du paramètre
  $better = $_GET["better"];

  $query =
    " SELECT      contest.id, contest.shortName, contest.longName, contest.startDate, contest.endDate, contest.day" .
    " FROM        contest" .
    " JOIN        betting" .
    "             ON    contest.id = betting.contest_id" .
    " WHERE       betting.better_id = " . $better .
    "             AND   contest.startDate <= NOW()" .
    "             AND   contest.endDate >= NOW()";

  $req = $db->query($query);
  $res = $req->fetchAll(PDO::FETCH_ASSOC);
  
  // Lecture des séries de chaque concours
  foreach($res as $contest => &$c) {
    $query =
      " SELECT    category.id, category.shortName, category.longName" .
      " FROM      category" .
      " WHERE     category.contest_id = " . $c["id"];

      $req = $db->query($query);
      $categories = $req->fetchAll(PDO::FETCH_ASSOC);
      $c["categories"] = $categories;
  }

  echo json_encode($res, JSON_NUMERIC_CHECK);
?>