<?php
  include_once("../common.php");

  // Lecture du paramètre
  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      try {
        $query =
          " SELECT    cpi_better.id" .
          " FROM      cpi_better" .
          " WHERE     cpi_better.accessKey = ?";
      
        $req = $db->prepare($query);
        $req->execute(array($accessKey));
        $res = $req->fetchAll(PDO::FETCH_ASSOC);

        if ($res && sizeof($res)) {
          $query =
            " CALL      sp_delete_better(" . $res[0]["id"] . ")";

          $db->exec($query);

        } else {
          return http_response_code(404);
        }
      } catch(PDOException $e) {
        $error = array("message" => $db->errorInfo());
        echo json_encode($error);
        return http_response_code(404);
    }
    } else {
      echo returnIsOffline();
    }
  } else {
    echo returnIsOffline();
  }
?>