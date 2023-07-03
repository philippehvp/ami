<?php
  include_once("../common.php");

  // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT      cpi_contest.id, cpi_contest.shortName, cpi_contest.longName, cpi_contest.startDate, cpi_contest.endBetDate, cpi_contest.day" .
        " FROM        cpi_contest" .
        " JOIN        cpi_betting" .
        "             ON    cpi_contest.id = cpi_betting.contest_id" .
        " JOIN        cpi_better" .
        "             ON    cpi_betting.better_id = cpi_better.id" .
        " WHERE       cpi_better.accessKey = ?" .
        "             AND   cpi_contest.startDate <= NOW()" .
        "             AND   cpi_contest.endAdminDate >= NOW()" .
        " ORDER BY    cpi_contest.id";
    
      $req = $db->prepare($query);
      $req->execute(array($accessKey));
      $res = $req->fetchAll(PDO::FETCH_ASSOC);
      
      // Lecture des séries de chaque concours
      foreach($res as $contest => &$c) {
        $query =
          " SELECT    cpi_category.id, cpi_category.shortName, cpi_category.longName" .
          " FROM      cpi_category" .
          " WHERE     cpi_category.contest_id = " . $c["id"];
    
        $req = $db->query($query);
        $categories = $req->fetchAll(PDO::FETCH_ASSOC);
        $c["categories"] = $categories;
      }
      echo json_encode($res, JSON_NUMERIC_CHECK);
    } else {
      echo returnIsOffline();
    }
  } else {
    echo returnIsOffline();
  }
?>