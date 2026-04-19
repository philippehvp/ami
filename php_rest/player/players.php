<?php
  include_once("../common.php");

  $data = json_decode(file_get_contents("php://input"), true);
  $category = json_decode($data["category"]) ? json_decode($data["category"]) : $data["category"];


  $query =
    " SELECT      cpi_player.id," .
    "             cpi_player.playerName1," .
    "             cpi_player.playerName2" .
    " FROM        cpi_player" .
    " WHERE       cpi_player.category_id = ?";

  $req = $db->prepare($query);
  $req->execute(array($category));
  $res = $req->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($res, JSON_NUMERIC_CHECK);
?>