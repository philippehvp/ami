<?php
  include_once("../common.php");

  // Lecture des paramètres
  $data = json_decode(file_get_contents("php://input"), true);
  $name = json_decode($data["name"]) ? json_decode($data["name"]) : $data["name"];
  $firstName = json_decode($data["firstName"]) ? json_decode($data["firstName"]) : $data["firstName"];
  $password = json_decode($data["password"]) ? json_decode($data["password"]) : $data["password"];
  $contact = json_decode($data["contact"]) ? json_decode($data["contact"]) : $data["contact"];
  $club = json_decode($data["club"]) ? json_decode($data["club"]) : $data["club"];

  if (trim($name) == "" || trim($firstName) == "" || trim($password) == "" || trim($contact) == "") {
    return http_response_code(400);
  } else {
    try {
      // On vérifie que le pronostiqueur ayant ce login de connexion (nom + mot de passe) ne soit pas existant dans la base
      $query =
        " SELECT    cpi_better.id" .
        " FROM      cpi_better" .
        " WHERE     UPPER(cpi_better.name) = ?" .
        "           AND   cpi_better.password = ?";
      
      $req = $db->prepare($query);
      $req->execute(array(strtoupper($name), $password));
      $res = $req->fetchAll(PDO::FETCH_ASSOC);

      if ($res && sizeof($res)) {
        // Nom existant
        $ret = array("errorMessage" => "Le pronostiqueur existe");
        echo json_encode($ret);
      } else {
        $now = new DateTime();
        $accessKey = generateAccessKey($name . $firstName . $now->getTimestamp());
        $randomKey = generateAccessKey($name . $firstName . "randomKey" . $now->getTimestamp());

        // Ajout du pronostiqueur dans la table des participants
        $query =
          " INSERT INTO         cpi_better(name, firstName, password, isAdmin, accessKey, randomKey, endAccessKeyValidityDate, contact, club, isTutorialDone, evaluation)" .
          " SELECT              ?, ?, ?, ?, ?, ?, fn_connection_validity(), ?, ?, ?, ?" .
          " WHERE               fn_can_create_better() = 1";
        $req = $db->prepare($query);
        $req->execute(array(strtoupper($name), $firstName, $password, 0, $accessKey, $randomKey, $contact, $club, 0, -1));
    
        // Identifiant du dernier enregistrement ajouté
        $betterId = $db->lastInsertId();
    
        // Création des lignes dans les tables de pronostics
        $query =
          " CALL sp_create_missing_bets(" . $betterId . ")";
        $db->exec($query);

        // Création du paramétrage de l'interface
        $query =
          " INSERT INTO         cpi_setting(better_id, clubName, autoNavigation, playerReverse, theme_id, firstnameVisible)" .
          " SELECT              ?, 0, 0, 0, 0, 1" .
          " WHERE               fn_can_create_better() = 1";
        $req = $db->prepare($query);
        $req->execute(array($betterId));

        // Lecture de la date maximale de pronostic de la journée en cours
        $query = "SELECT fn_end_bet_date() AS endBetDate";
        $req = $db->query($query); 
        $res = $req->fetchAll(PDO::FETCH_ASSOC);
        if ($res && sizeof($res)) {
          $endBetDate = $res[0]["endBetDate"];
        } else {
          $endBetDate  = null;
        }

        $ret = array(
          "accessKey" => $accessKey,
          "randomKey" => $randomKey,
          "name" => $name,
          "firstName" => $firstName,
          "isAdmin" => 0,
          "club" => $club,
          "isTutorialDone" => 0,
          "evaluation" => -1,
          "endBetDate" => $endBetDate,
          "setting" => array(
            "clubName" => 0,
            "autoNavigation" => 0,
            "playerReverse" => 0,
            "theme_id" => 1
          )
        );

        echo json_encode($ret, JSON_NUMERIC_CHECK);
      }
    } catch(PDOException $e) {
      $error = array("errorMessage" => $db->errorInfo());
      echo json_encode($error);
      return http_response_code(400);
    }
  }
?>