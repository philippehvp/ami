<?php
  include_once("../common.php");

  $data = json_decode(file_get_contents("php://input"), true);
  $accessKey = json_decode($data["accessKey"]) ? json_decode($data["accessKey"]) : $data["accessKey"];

  if ($accessKey) {
    if (isAccessKeyValid($db, $accessKey)) {
      if (isBetsErasable($db, $accessKey)) {
        $query =
          " UPDATE            cpi_bet" .
          " JOIN              cpi_better" .
          "                   ON    cpi_bet.better_id = cpi_better.id" .
          " JOIN              cpi_category" .
          "                   ON    cpi_bet.category_id = cpi_category.id" .
          " JOIN              (" .
          "                     SELECT DISTINCT       cpi_contest.id," .
          "                                           cpi_contest.startDate," .
          "                                           cpi_contest.endBetDate, cpi_contest.endAdminDate" .
          "                     FROM                  cpi_contest" .
          "                     WHERE                 cpi_contest.startDate <= NOW()" .
          "                                           AND   NOW() <= cpi_contest.endAdminDate" .
          "                   ) cpi_contest" .
          "                   ON    cpi_category.contest_id = cpi_contest.id" .
          " SET               cpi_bet.runnerUp_player_id = NULL," .
          "                   cpi_bet.winner_player_id = NULL" .
          " WHERE             cpi_better.accessKey = ?";
        $req = $db->prepare($query);
        $req->execute(array($accessKey));
  
        return http_response_code(201);
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