<?php
  include_once("../common.php");

  // Lecture des paramètres
  $data = json_decode(file_get_contents("php://input"), true);
  $name = json_decode($data["name"]) ? json_decode($data["name"]) : $data["name"];
  $password = json_decode($data["password"]) ? json_decode($data["password"]) : $data["password"];

  if ($name && $password) {
    $query =
      " SELECT DISTINCT     cpi_better.accessKey, cpi_better.id, cpi_better.name, cpi_better.firstName, cpi_better.isAdmin, cpi_better.isTutorialDone" .
      " FROM                cpi_better" .
      " WHERE               UPPER(cpi_better.name) = ?" .
      "                     AND   cpi_better.password = ?";
  
    $req = $db->prepare($query);
    $req->execute(array(strtoupper($name), $password));
    $res = $req->fetchAll(PDO::FETCH_ASSOC);

    // Si le pronostiqueur a été trouvé, alors on lui génère une nouvelle clé et on met à jour la date de fin de validité
    if ($res && sizeof($res)) {
      $better = $res[0];
      $betterId = $better["id"];
      $now = new DateTime();
      $accessKey = generateAccessKey($better["name"] . $better["firstName"] . $now->getTimestamp());

      // Création des lignes dans les tables de pronostics
      $query =
        " CALL sp_create_missing_bets(" . $betterId . ")";
      $db->exec($query);

      $query =
        " UPDATE          cpi_better" .
        " SET             cpi_better.accessKey = ?," .
        "                 cpi_better.endAccessKeyValidityDate = fn_connection_validity()" .
        " WHERE           cpi_better.id = ?";
  
      $req = $db->prepare($query);
      $req->execute(array($accessKey, $betterId));

      $ret = array("accessKey" => $accessKey, "name" => $better["name"], "firstName" => $better["firstName"], "isAdmin" => $better["isAdmin"], "isTutorialDone" => $better["isTutorialDone"]);

      echo json_encode($ret, JSON_NUMERIC_CHECK);
    }
  } else {
    echo json_encode('{}', JSON_NUMERIC_CHECK);
  }

?>