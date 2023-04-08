<?php
  include_once("../common.php");

  // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " SELECT      contest.id, contest.shortName, contest.longName, contest.startDate, contest.endDate, contest.day" .
        " FROM        contest" .
        " JOIN        betting" .
        "             ON    contest.id = betting.contest_id" .
        " JOIN        better" .
        "             ON    betting.better_id = better.id" .
        " WHERE       better.accessKey = ?" .
        "             AND   contest.startDate <= NOW()" .
        "             AND   contest.endDate >= NOW()";
    
      $req = $db->prepare($query);
      $req->execute(array($accessKey));
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
    } else {
      echo returnIsOffline();
    }

  } else {
    echo json_encode([]);
  }


?>