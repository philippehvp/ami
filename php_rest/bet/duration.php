<?php
  include_once("../common.php");

  // Lecture des paramètres
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if ($accessKey) {
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
      " JOIN                better" .
      "                     ON    duration.better_id = better.id" .
      " WHERE               better.accessKey = ?";
  
    $req = $db->prepare($query);
    $req->execute(array($accessKey));
    $res = $req->fetchAll(PDO::FETCH_ASSOC);
    if ($res && sizeof($res)) {
      echo json_encode($res[0], JSON_NUMERIC_CHECK);
    } else {
      echo json_encode("{}");
    }
  } else {
    echo json_encode("{}");
  }

?>