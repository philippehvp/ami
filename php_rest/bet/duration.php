<?php
  include_once("../common.php");

  // Lecture des paramètres
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT DISTINCT     cpi_duration.duration," .
        "                     CASE" .
        "                       WHEN cpi_better.isAdmin = 1 AND cpi_contest.startDate <= NOW() AND NOW() <= cpi_contest.endAdminDate THEN 1" .
        "                       WHEN cpi_better.isAdmin = 0 AND cpi_contest.startDate <= NOW() AND NOW() <= cpi_contest.endBetDate THEN 1" .
        "                       ELSE 0" .
        "                     END AS isDurationUpdatable" .
        " FROM                cpi_duration" .
        " JOIN                (" .
        "                       SELECT DISTINCT       cpi_contest.day," .
        "                                             cpi_contest.startDate," .
        "                                             cpi_contest.endBetDate, cpi_contest.endAdminDate" .
        "                       FROM                  cpi_contest" .
        "                       WHERE                 cpi_contest.startDate <= NOW()" .
        "                                             AND   NOW() <= cpi_contest.endAdminDate" .
        "                       LIMIT 1" .
        "                     ) cpi_contest" .
        "                     ON    cpi_duration.contest_day = cpi_contest.day" .
        " JOIN                cpi_better" .
        "                     ON    cpi_duration.better_id = cpi_better.id" .
        " WHERE               cpi_better.accessKey = ?";
    
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