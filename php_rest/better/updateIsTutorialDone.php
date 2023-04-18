<?php
  include_once("../common.php");

  // Lecture des paramètres
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      try {
        // Mise à jour du champ isTutorialDone pour indiquer que le pronostiqueur a déjà vu le tutoriel
        $query =
          " UPDATE    cpi_better" .
          " SET       cpi_better.isTutorialDone = 1" .
          " WHERE     cpi_better.accessKey = ?";
        $req = $db->prepare($query);
        $req->execute(array($accessKey));
  
        return http_response_code(201);
      } catch(PDOException $e) {
        $error = array("message" => $db->errorInfo());
        echo json_encode($error);
        return http_response_code(400);
      }
    } else {
      echo returnIsOffline();
    }
  } else {
    return http_response_code(204);
  }
?>