<?php
  include_once("../common.php");

  // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $byRanking = json_decode($data["byRanking"]) ? json_decode($data["byRanking"]) : $data["byRanking"];

  if ($accessKey && ($byRanking == 0 || $byRanking == 1)) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT      cpi_better.name, cpi_better.firstName, cpi_better.randomKey, cpi_ranking.points, cpi_ranking.ranking, cpi_duration.duration" .
        " FROM        cpi_better" .
        " JOIN        cpi_ranking" .
        "             ON    cpi_better.id = cpi_ranking.better_id" .
        " JOIN        (" .
        "                 SELECT                MAX(cpi_contest.day) AS day" .
        "                 FROM                  cpi_contest" .
        "                 WHERE                 cpi_contest.startDate <= NOW()" .
        "             ) cpi_contest" .
        "             ON    cpi_ranking.contest_day = cpi_contest.day" .
        " JOIN        cpi_duration" .
        "             ON    cpi_better.id = cpi_duration.better_id" .
        "                   AND   cpi_contest.day = cpi_duration.contest_day" .
        " WHERE       cpi_better.isAdmin <> 1";

      if ($byRanking == 1) {
        $query .= " ORDER BY    cpi_ranking.ranking, cpi_better.name, cpi_better.firstName, cpi_better.id";
      } else {
        $query .= " ORDER BY    cpi_better.name, cpi_better.firstName, cpi_better.id";
      }
      $req = $db->query($query);
      $rankings = $req->fetchAll(PDO::FETCH_ASSOC);

      // Nombre de séries terminées
      $query =
        " SELECT      fn_completed_categories() AS completed";
      $req = $db->query($query);
      $res = $req->fetchAll(PDO::FETCH_ASSOC);
      $completedCategories = $res[0]["completed"];

      $betterRanking = array(
        "completedCategories" => $completedCategories,
        "rankings" => $rankings
      );

      echo json_encode($betterRanking, JSON_NUMERIC_CHECK);
    } else {
      echo returnIsOffline();
    }
  } else {
    echo returnIsOffline();
  }
?>