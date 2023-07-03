<?php
  include_once("../common.php");

  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $evaluation = json_decode($data["evaluation"]) ? json_decode($data["evaluation"]) : $data["evaluation"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " UPDATE            cpi_better" .
        " SET               cpi_better.evaluation = ?" .
        " WHERE             cpi_better.accessKey = ?";
  
      $req = $db->prepare($query);
      $req->execute(array($evaluation, $accessKey));
  
      $ret = array("evaluation" => $evaluation);
      echo json_encode($ret, JSON_NUMERIC_CHECK);
    } else {
      echo returnIsOffline();
    }
  } else {
    echo returnIsOffline();
  }
?>