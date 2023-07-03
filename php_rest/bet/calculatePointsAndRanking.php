<?php
  include_once("../common.php");

  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " CALL      sp_calculate_point_ranking()";
      
      $db->query($query);
      $ret = array("calculate" => 1);
      echo json_encode($ret, JSON_NUMERIC_CHECK);
    } else {
      echo returnIsOffline();
    }
  } else {
    echo returnIsOffline();
  }
?>