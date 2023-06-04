<?php
  include_once("../common.php");

  // Lecture de la date maximale de pronostic de la journée en cours
  $query = "SELECT fn_can_create_better() AS canCreateBetter";
  $req = $db->query($query); 
  $res = $req->fetchAll(PDO::FETCH_ASSOC);

  $ret = array(
    "canCreateBetter" => $res[0]["canCreateBetter"]
  );
  echo json_encode($ret, JSON_NUMERIC_CHECK);

?>