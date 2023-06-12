<?php
  include_once("../common.php");

  $query =
    " SELECT      cpi_universe.id, cpi_universe.folder, cpi_universe.name" .
    " FROM        cpi_universe" .
    " ORDER BY    cpi_universe.name";
  $req = $db->query($query);
  $universes = $req->fetchAll(PDO::FETCH_ASSOC);

  $query =
    " SELECT      cpi_avatar.id, cpi_avatar.universe_id, cpi_avatar.name, cpi_avatar.file" .
    " FROM        cpi_avatar" .
    " ORDER BY    cpi_avatar.name";
  $req = $db->query($query);
  $avatars = $req->fetchAll(PDO::FETCH_ASSOC);

  $res = array(
    "universes" => $universes,
    "avatars" => $avatars
  );

  echo json_encode($res, JSON_NUMERIC_CHECK);



?>