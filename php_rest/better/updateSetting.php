<?php
  include_once("../common.php");

  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $clubName = json_decode($data["clubName"]) ? json_decode($data["clubName"]) : $data["clubName"];
  $autoNavigation = json_decode($data["autoNavigation"]) ? json_decode($data["autoNavigation"]) : $data["autoNavigation"];
  $playerReverse = json_decode($data["playerReverse"]) ? json_decode($data["playerReverse"]) : $data["playerReverse"];
  $theme = json_decode($data["theme"]) ? json_decode($data["theme"]) : $data["theme"];
  $playerRanking = json_decode($data["playerRanking"]) ? json_decode($data["playerRanking"]) : $data["playerRanking"];
  $firstnameVisible = json_decode($data["firstnameVisible"]) ? json_decode($data["firstnameVisible"]) : $data["firstnameVisible"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      $query =
        " UPDATE            cpi_setting" .
        " JOIN              cpi_better" .
        "                   ON    cpi_setting.better_id = cpi_better.id" .
        " SET               cpi_setting.clubName = ?, cpi_setting.autoNavigation = ?, cpi_setting.playerReverse = ?," .
        "                   cpi_setting.theme_id = ?, cpi_setting.playerRanking = ?, cpi_setting.firstnameVisible = ?" .
        " WHERE             cpi_better.accessKey = ?";
  
      $req = $db->prepare($query);
      $req->execute(array($clubName, $autoNavigation, $playerReverse, $theme, $playerRanking, $firstnameVisible, $accessKey));
  
      $ret = array("setting" =>
        array(
          "clubName" => $clubName,
          "autoNavigation" => $autoNavigation,
          "playerReverse" => $playerReverse,
          "firstnameVisible" => $firstnameVisible,
          "theme" => $theme)
      );
      echo json_encode($ret, JSON_NUMERIC_CHECK);
    } else {
      echo returnIsOffline();
    }
  } else {
    echo returnIsOffline();
  }
?>