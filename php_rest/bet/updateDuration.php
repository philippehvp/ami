<?php
  include_once("../common.php");

  $data = json_decode(file_get_contents("php://input"), true);
  $better = json_decode($data["better"]);
  $isAdmin = json_decode($data["isAdmin"]);
  $duration = json_decode($data["duration"]);

  if ($better && !is_null($isAdmin)) {
    if (isUpdatable($db, 0, $isAdmin)) {
      $query =
        " UPDATE            duration" .
        " JOIN              (" .
        "                       SELECT DISTINCT       contest.day" .
        "                       FROM                  contest" .
        "                       WHERE                 DATE(contest.startDate) <= DATE(NOW())" .
        "                                             AND   DATE(contest.endDate) >= DATE(NOW())" .
        "                   ) day" .
        "                   ON    duration.contest_day = day.day" .
        " SET               duration.duration = ?" .
        " WHERE             duration.better_id = ?";
  
      $req = $db->prepare($query);
      $req->execute(array($duration, $better));
  
      return http_response_code(200);
    } else {
      return http_response_code(204);  
    }
  } else {
    return http_response_code(204);
  }
?>