<?php
  include_once("../common.php");

  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];
  $duration = json_decode($data["duration"]) ? json_decode($data["duration"]) : $data["duration"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      if (isDurationUpdatable($db, $accessKey)) {
        $query =
          " UPDATE            duration" .
          " JOIN              (" .
          "                       SELECT DISTINCT       contest.day" .
          "                       FROM                  contest" .
          "                       WHERE                 contest.startDate <= NOW()" .
          "                                             AND   NOW() <= contest.endAdminDate" .
          "                   ) day" .
          "                   ON    duration.contest_day = day.day" .
          " JOIN              better" .
          "                   ON    duration.better_id = better.id" .
          " SET               duration.duration = ?" .
          " WHERE             better.accessKey = ?";
    
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