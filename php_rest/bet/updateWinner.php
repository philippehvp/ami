<?php
  include_once("../common.php");

  $data = json_decode(file_get_contents("php://input"), true);
  $better = json_decode($data["better"]);
  $isAdmin = json_decode($data["isAdmin"]);
  $contest = json_decode($data["contest"]);
  $category = json_decode($data["category"]);
  $player = json_decode($data["player"]);

  if ($better && $contest && $category) {
    if (isUpdatable($db, $contest, $isAdmin)) {
      $query =
        " UPDATE            bet" .
        " SET               winner_player_id = ?" .
        " WHERE             bet.better_id = ?" .
        "                   AND   bet.category_id = ?";
      $req = $db->prepare($query);
      $req->execute(array($player, $better, $category));

      return http_response_code(200);
    }
  } else {
    return http_response_code(204);
  }
?>