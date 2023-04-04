<?php
  include_once("../common.php");

  // Lecture du paramètre
  $contest = $_GET["contest"];
  
  if ($contest) {
    $query =
      " SELECT			category.id, category.shortName, category.longName" .
      " FROM        category" .
      " JOIN        contest" .
      "             ON    category.contest_id = contest.id" .
      " WHERE       contest.id = " . $contest;

    $req = $db->query($query);
    $res = $req->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($res, JSON_NUMERIC_CHECK);
  } else {
    echo json_encode(json_decode("[]"));
  }
?>