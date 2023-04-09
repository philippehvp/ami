<?php
  include_once("../common.php");

  $query =
    " SELECT DISTINCT     better.accessKey, better.name, better.firstName, better.isAdmin" .
    " FROM                better" .
    " JOIN                betting" .
    "                     ON    better.id = betting.better_id" .
    " JOIN                contest" .
    "                     ON    better.id = betting.better_id" .
    "                           AND   betting.contest_id = contest.id" .
    " WHERE               contest.startDate <= NOW()" .
    "                     AND   NOW() <=" .
    "                             CASE" .
    "                               WHEN better.isAdmin = 1 THEN contest.endAdminDate" .
    "                               ELSE contest.endADminDate" .
    "                             END";

  $req = $db->query($query);
  $res = $req->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($res, JSON_NUMERIC_CHECK);
?>