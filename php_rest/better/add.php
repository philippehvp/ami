<?php
  include_once("../common.php");

  $data = json_decode(file_get_contents("php://input"), true);
  $name = json_decode($data["name"]) ? json_decode($data["name"]) : $data["name"];
  $firstName = json_decode($data["firstName"]) ? json_decode($data["firstName"]) : $data["firstName"];
  $club = json_decode($data["club"]) ? json_decode($data["club"]) : $data["club"];

  if (trim($name) == "" || trim($firstName) == "") {
    return http_response_code(400);
  } else {
    try {
      // Ajout du parieur dans la table des participants
      $query =
        " INSERT INTO         better(better.name, better.firstName, better.club, better.isAdmin)" .
        " VALUES              (?, ?, ?, ?)";
  
      $req = $db->prepare($query);
      $req->execute(array($name, $firstName, $club, 0));
  
      // Identifiant du dernier enregistrement ajouté
      $better = $db->lastInsertId();
  
      // Inscription du parieur dans la table de participation
      $query =
        " INSERT INTO         betting(better_id, contest_id)" .
        " SELECT              " . $better . ", contest.id" .
        " FROM                contest" .
        " WHERE               contest.startDate <= NOW()" .
        "                     AND   contest.endDate >= NOW()";
      $db->exec($query);

      // Création de tous les pronostics
      $query =
        " INSERT INTO         bet(better_id, category_id, winner_player_id, runnerUp_player_id)" .
        " SELECT              " . $better . ", category.id, NULL, NULL" .
        " FROM                contest" .
        " JOIN                category" .
        "                     ON    contest.id = category.contest_id" .
        " WHERE               contest.startDate <= NOW()" .
        "                     AND   contest.endDate >= NOW()";
      $db->exec($query);

      // Création du pronostic sur la durée du match le plus long
      $query =
        " INSERT INTO         duration(better_id, day_id, duration)" .
        " SELECT DISTINCT     " . $better . ", contest.day, 0" .
        " FROM                contest" .
        " WHERE               DATE(contest.startDate) <= DATE(NOW())" .
        "                     AND   DATE(contest.endDate) >= DATE(NOW())";
      $db->exec($query);

    } catch(PDOException $e) {
      print($e);
      return http_response_code(400);
    }
  }  

  return http_response_code(201);

?>