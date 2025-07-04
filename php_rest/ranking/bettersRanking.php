<?php
  include_once("../common.php");

  // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);

  if(!isset($data["accessKey"])) {
    echo returnIsOffline();
    return;
  }

  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $byRanking = json_decode($data["byRanking"]) ? json_decode($data["byRanking"]) : $data["byRanking"];
  $day = json_decode($data["day"]) ? json_decode($data["day"]) : $data["day"];

  if ($accessKey && ($byRanking == 0 || $byRanking == 1)) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT      cpi_better.name, cpi_better.firstName, cpi_better.randomKey, cpi_ranking.points, cpi_ranking.ranking, cpi_duration.duration" .
        " FROM        cpi_better" .
        " JOIN        cpi_ranking" .
        "             ON    cpi_better.id = cpi_ranking.better_id" .
        " JOIN        (     SELECT    *" .
        "                   FROM      cpi_contest" .
        "                   LIMIT 1" .
        "             ) cpi_contest" .
        "             ON    cpi_ranking.contest_day = cpi_contest.day" .
        " JOIN        cpi_duration" .
        "             ON    cpi_better.id = cpi_duration.better_id" .
        "                   AND   cpi_contest.day = cpi_duration.contest_day" .
        " WHERE       cpi_contest.day = " . $day .
        "             AND   cpi_better.isAdmin <> 1";

      if ($byRanking == 1) {
        $query .= " ORDER BY    cpi_ranking.ranking, cpi_better.name, cpi_better.firstName, cpi_better.id";
      } else {
        $query .= " ORDER BY    cpi_better.name, cpi_better.firstName, cpi_better.id";
      }
      $req = $db->query($query);
      $rankings = $req->fetchAll(PDO::FETCH_ASSOC);

      // Nombre de séries terminées et nombre de séries total
      $query =
        " SELECT      fn_completed_categories(" . $day . ") AS completed," .
        "             fn_count_of_categories(" . $day . ") AS countOfCategories";
      $req = $db->query($query);
      $res = $req->fetchAll(PDO::FETCH_ASSOC);
      $completedCategories = $res[0]["completed"];
      $countOfCategories = $res[0]["countOfCategories"];

      $betterRanking = array(
        "completedCategories" => $completedCategories,
        "countOfCategories" => $countOfCategories,
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