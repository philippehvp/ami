<?php
  include_once("../common.php");

  // Lecture des paramètres
  $data = json_decode(file_get_contents("php://input"), true);
  $account = json_decode($data["account"]) ? json_decode($data["account"]) : $data["account"];
  $password = json_decode($data["password"]) ? json_decode($data["password"]) : $data["password"];

  if ($account && $password) {
    $query =
      " SELECT DISTINCT     better.accessKey, better.id, better.name, better.firstName, better.isAdmin" .
      " FROM                better" .
      " WHERE               better.account = ?" .
      "                     AND   better.password = ?";
  
    $req = $db->prepare($query);
    $req->execute(array($account, $password));
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
        " UPDATE          better" .
        " SET             better.accessKey = ?," .
        "                 better.endAccessKeyValidityDate = fn_connection_validity()" .
        " WHERE           better.id = ?";
  
      $req = $db->prepare($query);
      $req->execute(array($accessKey, $betterId));

      $ret = array("accessKey" => $accessKey, "name" => $better["name"], "firstName" => $better["firstName"], "isAdmin" => $better["isAdmin"]);

      echo json_encode($ret, JSON_NUMERIC_CHECK);
    }
  } else {
    echo json_encode('{}', JSON_NUMERIC_CHECK);
  }

?>