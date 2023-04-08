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
          "                       WHERE                 DATE(contest.startDate) <= DATE(NOW())" .
          "                                             AND   DATE(contest.endDate) >= DATE(NOW())" .
          "                   ) day" .
          "                   ON    duration.contest_day = day.day" .
          " JOIN              better" .
          "                   ON    duration.better_id = better.id" .
          " SET               duration.duration = ?" .
          " WHERE             better.accessKey = ?";
    
        $req = $db->prepare($query);
        $req->execute(array($duration, $accessKey));
    
        return http_response_code(200);
      } else {
        return http_response_code(204);  
      }
    } else {
      echo returnIsOffline();
    }
  } else {
    return http_response_code(204);
  }
?>