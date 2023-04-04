<?php
  include_once("../common.php");

  // Lecture des paramètres
  $better = $_GET["better"];

  if ($better) {
    $query =
      " SELECT DISTINCT     duration.duration" .
      " FROM                duration" .
      " JOIN                (" .
      "                       SELECT DISTINCT       contest.day" .
      "                       FROM                  contest" .
      "                       WHERE                 contest.startDate <= NOW()" .
      "                                             AND   contest.endDate >= NOW()" .
      "                     ) day" .
      "                     ON    duration.contest_day = day.day" .
      " WHERE               duration.better_id = ?";
  
    $req = $db->prepare($query);
    $req->execute(array($better));
    $res = $req->fetchAll(PDO::FETCH_ASSOC);
    if ($res && sizeof($res)) {
      echo json_encode($res[0], JSON_NUMERIC_CHECK);
    } else {
      echo json_encode(json_decode("{}"));
    }
  } else {
    echo json_encode(json_decode("{}"));
  }

?>