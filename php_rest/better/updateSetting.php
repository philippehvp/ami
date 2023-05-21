<?php
  include_once("../common.php");

  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $clubName = json_decode($data["clubName"]) ? json_decode($data["clubName"]) : $data["clubName"];
  $autoNavigation = json_decode($data["autoNavigation"]) ? json_decode($data["autoNavigation"]) : $data["autoNavigation"];
  $playerReverse = json_decode($data["playerReverse"]) ? json_decode($data["playerReverse"]) : $data["playerReverse"];
  $darkMode = json_decode($data["darkMode"]) ? json_decode($data["darkMode"]) : $data["darkMode"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " UPDATE            cpi_setting" .
        " JOIN              cpi_better" .
        "                   ON    cpi_setting.better_id = cpi_better.id" .
        " SET               cpi_setting.clubName = ?, cpi_setting.autoNavigation = ?, cpi_setting.playerReverse = ?, cpi_setting.darkMode = ?" .
        " WHERE             cpi_better.accessKey = ?";
  
      $req = $db->prepare($query);
      $req->execute(array($clubName, $autoNavigation, $playerReverse, $darkMode, $accessKey));
  
      $ret = array("setting" => array("clubName" => $clubName, "autoNavigation" => $autoNavigation, "playerReverse" => $playerReverse, "darkMode" => $darkMode));
      echo json_encode($ret, JSON_NUMERIC_CHECK);
    } else {
      echo returnIsOffline();
    }
  } else {
    return http_response_code(204);
  }
?>