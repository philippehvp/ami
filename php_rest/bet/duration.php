<?php
  include_once("../common.php");

  // Lecture des paramètres
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT DISTINCT     duration.duration," .
        "                     CASE" .
        "                       WHEN better.isAdmin = 1 AND contest.startDate <= NOW() AND NOW() <= contest.endAdminDate THEN 1" .
        "                       WHEN better.isAdmin = 0 AND contest.startDate <= NOW() AND NOW() <= contest.endBetDate THEN 1" .
        "                       ELSE 0" .
        "                     END AS isDurationUpdatable" .
        " FROM                duration" .
        " JOIN                (" .
        "                       SELECT DISTINCT       contest.day," .
        "                                             contest.startDate," .
        "                                             contest.endBetDate, contest.endAdminDate" .
        "                       FROM                  contest" .
        "                       WHERE                 contest.startDate <= NOW()" .
        "                                             AND   NOW() <= contest.endAdminDate" .
        "                       LIMIT 1" .
        "                     ) contest" .
        "                     ON    duration.contest_day = contest.day" .
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
      echo returnIsOffline();
    }
  } else {
    echo json_encode("{}");
  }

?>