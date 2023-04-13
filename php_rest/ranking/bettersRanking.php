<?php
  include_once("../common.php");

  // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT      better.name, better.firstName, ranking.points, ranking.ranking, duration.duration" .
        " FROM        better" .
        " JOIN        ranking" .
        "             ON    better.id = ranking.better_id" .
        " JOIN        (" .
        "                 SELECT DISTINCT       contest.day" .
        "                 FROM                  contest" .
        "                 WHERE                 contest.startDate <= NOW()" .
        "                                       AND   NOW() <= contest.endAdminDate" .
        "                 LIMIT 1" .
        "             ) contest" .
        "             ON    ranking.contest_day = contest.day" .
        " JOIN        duration" .
        "             ON    better.id = duration.better_id" .
        "                   AND   contest.day = duration.contest_day" .
        " WHERE       better.isAdmin <> 1" .
        " ORDER BY    ranking.ranking, better.name, better.firstName";

      $req = $db->query($query);
      $res = $req->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($res, JSON_NUMERIC_CHECK);
    } else {
      echo returnIsOffline();
    }
  } else {
    echo json_encode([]);
  }
?>