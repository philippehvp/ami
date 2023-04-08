<?php
  include_once("../common.php");

  // Lecture des paramètres
  $data = json_decode(file_get_contents("php://input"), true);
  $account = json_decode($data["account"]) ? json_decode($data["account"]) : $data["account"];
  $password = json_decode($data["password"]) ? json_decode($data["password"]) : $data["password"];
  $name = json_decode($data["name"]) ? json_decode($data["name"]) : $data["name"];
  $firstName = json_decode($data["firstName"]) ? json_decode($data["firstName"]) : $data["firstName"];
  $contact = json_decode($data["contact"]) ? json_decode($data["contact"]) : $data["contact"];

  if (trim($account) == "" || trim($password) == "" || trim($name) == "" || trim($firstName) == "" || trim($contact) == "") {
    return http_response_code(400);
  } else {
    try {
      // On vérifie que le pronostiqueur ayant ce login de connexion ne soit pas existant dans la base
      $query =
        " SELECT    better.id" .
        " FROM      better" .
        " WHERE     better.account = ?";
      
      $req = $db->prepare($query);
      $req->execute(array($account));
      $res = $req->fetchAll(PDO::FETCH_ASSOC);

      if ($res && sizeof($res)) {
        // Nom existant
        $ret = array("errorMessage" => "Pronostiqueur existant");
        echo json_encode($ret);
      } else {
        $endAccessKeyValidityDate = generateEndAccessValidityDate();
        $now = new DateTime();
        $accessKey = generateAccessKey($name . $firstName . $now->getTimestamp());

        // Ajout du pronostiqueur dans la table des participants
        $query =
          " INSERT INTO         better(better.account, better.password, better.name, better.firstName, better.isAdmin, better.accessKey, better.endAccessKeyValidityDate, better.contact)" .
          " VALUES              (?, ?, ?, ?, ?, ?, FROM_UNIXTIME(" . $endAccessKeyValidityDate->getTimeStamp() . "), ?)";
    
        $req = $db->prepare($query);
        $req->execute(array($account, $password, $name, $firstName, 0, $accessKey, $contact));
    
        // Identifiant du dernier enregistrement ajouté
        $better = $db->lastInsertId();
    
        // Inscription du pronostiqueur dans la table de participation (des deux journées si on est le premier jour également)
        $query =
          " INSERT INTO         betting(better_id, contest_id)" .
          " SELECT              " . $better . ", contest.id" .
          " FROM                contest" .
          " WHERE               contest.endDate > NOW()";
        $db->exec($query);

        // Création de tous les pronostics (des deux journées si on est le premier jour également)
        $query =
          " INSERT INTO         bet(better_id, category_id, winner_player_id, runnerUp_player_id)" .
          " SELECT              " . $better . ", category.id, NULL, NULL" .
          " FROM                contest" .
          " JOIN                category" .
          "                     ON    contest.id = category.contest_id" .
          " WHERE               contest.endDate > NOW()";
        $db->exec($query);

        // Création du pronostic sur la durée du match le plus long (des deux journées si on est le premier jour également)
        $query =
          " INSERT INTO         duration(better_id, contest_day, duration)" .
          " SELECT DISTINCT     " . $better . ", contest.day, 30" .
          " FROM                contest" .
          " WHERE               contest.endDate > NOW()";
        $db->exec($query);

        // Création des points des pronostiqueurs (des deux journées si on est le premier jour également)
        $query =
          " INSERT INTO         points(better_id, category_id, points)" .
          " SELECT              " . $better . ", category.id, 0" .
          " FROM                contest";

        $better = array(
          "accessKey" => $accessKey,
          "name" => $name,
          "firstName" => $firstName,
          "isAdmin" => 0,
          "endAccessKeyValidityDate" => $endAccessKeyValidityDate->getTimestamp()
        );
        echo json_encode($better, JSON_NUMERIC_CHECK);
      }
    } catch(PDOException $e) {
      $error = array("message" => $dbh->errorInfo());
      echo json_encode($error);
      return http_response_code(400);
    }
  }
?>