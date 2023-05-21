<?php
  include_once("../common.php");

  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $duration = json_decode($data["duration"]) ? json_decode($data["duration"]) : $data["duration"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      if (isDurationUpdatable($db, $accessKey)) {
        $query =
          " UPDATE            cpi_duration" .
          " JOIN              (" .
          "                       SELECT DISTINCT       cpi_contest.day" .
          "                       FROM                  cpi_contest" .
          "                       WHERE                 cpi_contest.startDate <= NOW()" .
          "                                             AND   NOW() <= cpi_contest.endAdminDate" .
          "                   ) cpi_day" .
          "                   ON    cpi_duration.contest_day = cpi_day.day" .
          " JOIN              cpi_better" .
          "                   ON    cpi_duration.better_id = cpi_better.id" .
          " SET               cpi_duration.duration = ?, cpi_duration.isDurationModified = 1" .
          " WHERE             cpi_better.accessKey = ?";
    
        $req = $db->prepare($query);
        $req->execute(array($duration, $accessKey));
    
        $ret = array("duration" => $duration);
        echo json_encode($ret, JSON_NUMERIC_CHECK);
      } else {
        echo returnIsNotUpdatable();
      }
    } else {
      echo returnIsOffline();
    }
  } else {
    return http_response_code(204);
  }
?>