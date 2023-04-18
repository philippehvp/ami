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
        " SELECT    cpi_better.id" .
        " FROM      cpi_better" .
        " WHERE     cpi_better.account = ?";
      
      $req = $db->prepare($query);
      $req->execute(array($account));
      $res = $req->fetchAll(PDO::FETCH_ASSOC);

      if ($res && sizeof($res)) {
        // Nom existant
        $ret = array("errorMessage" => "Pronostiqueur existant");
        echo json_encode($ret);
      } else {
        $now = new DateTime();
        $accessKey = generateAccessKey($name . $firstName . $now->getTimestamp());

        // Ajout du pronostiqueur dans la table des participants
        $query =
          " INSERT INTO         cpi_better(account, password, name, firstName, isAdmin, accessKey, endAccessKeyValidityDate, contact, isTutorialDone)" .
          " VALUES              (?, ?, ?, ?, ?, ?, fn_connection_validity(), ?, 0)";
        $req = $db->prepare($query);
        $req->execute(array($account, $password, $name, $firstName, 0, $accessKey, $contact));
    
        // Identifiant du dernier enregistrement ajouté
        $betterId = $db->lastInsertId();
    
        // Création des lignes dans les tables de pronostics
        $query =
          " CALL sp_create_missing_bets(" . $betterId . ")";
        $db->exec($query);

        $ret = array(
          "accessKey" => $accessKey,
          "name" => $name,
          "firstName" => $firstName,
          "isAdmin" => 0
        );
        echo json_encode($ret, JSON_NUMERIC_CHECK);
      }
    } catch(PDOException $e) {
      $error = array("message" => $db->errorInfo());
      echo json_encode($error);
      return http_response_code(400);
    }
  }
?>