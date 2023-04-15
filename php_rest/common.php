<?php
	session_start();

	const VALIDITY_DURATION = 15;
	
	function getContestStartDate($db, $contest) {
		$query =
			"   SELECT        contest.startDate" .
			"   FROM          contest" .
			"   WHERE         contest.id = ?";
		
		$req = $db->prepare($query);
    $req->execute(array($contest));
		$res = $req->fetchAll(PDO::FETCH_ASSOC);
		return new DateTime($res[0]["startDate"]);
	}

	function getContestEndDate($db, $contest, $accessKey) {
		$query =
			"   SELECT        CASE" .
      "                   WHEN better.isAdmin = 1 THEN contest.endAdminDate" .
      "                   ELSE contest.endBetDate" .
      "                 END AS endDate" .
			"   FROM          contest" .
      "   JOIN          betting" .
      "                 ON    contest.id = betting.contest_id" .
      "   JOIN          better" .
      "                 ON    betting.better_id = better.id" .
			"   WHERE         contest.id = ?" .
      "                 AND   better.accessKey = ?";
		
    $req = $db->prepare($query);
    $req->execute(array($contest, $accessKey));
		$res = $req->fetchAll(PDO::FETCH_ASSOC);
		return new DateTime($res[0]["endDate"]);
	}

  // function isAdmin($db, $accessKey) {
  //   $query =
  //     " SELECT        better.isAdmin" .
  //     " FROM          better" .
  //     " WHERE         better.accessKey = ?";

  //     $req = $db->prepare($query);
  //     $req->execute(array($accessKey));
  //     $res = $req->fetchAll(PDO::FETCH_ASSOC);
  //     return $res[0]["isAdmin"] == 1 ? true : false;
  // }

	function isUpdatable($db, $contest, $accessKey) {
    $query =
      " SELECT    CASE" .
      "               WHEN    contest.startDate <= NOW()" .
      "                       AND   NOW() <=" .
      "                             CASE    WHEN    better.isAdmin = 1" .
      "                                     THEN    contest.endAdminDate" .
      "                                     ELSE    contest.endBetDate" .
      "                             END" .
      "               THEN    1" .
      "               ELSE    0" .
      "           END AS isUpdatable" .
      " FROM      contest" .
      " JOIN      betting" .
      "           ON    contest.id = betting.contest_id" .
      " JOIN      better" .
      "           ON    betting.better_id = better.id" .
      " WHERE     contest.id = ?" .
      "           AND   better.accessKey = ?";

    $req = $db->prepare($query);
    $req->execute(array($contest, $accessKey));
    $res = $req->fetchAll(PDO::FETCH_ASSOC);
    if ($res && sizeof($res)) {
      return $res[0]["isUpdatable"] == 1;
    }

    return false;
	}

  function isDurationUpdatable($db, $accessKey) {
    $query =
      " SELECT DISTINCT       CASE" .
      "                         WHEN better.isAdmin = 1 AND contest.startDate <= NOW() AND NOW() <= contest.endAdminDate THEN 1" .
      "                         WHEN better.isAdmin = 0 AND contest.startDate <= NOW() AND NOW() <= contest.endBetDate THEN 1" .
      "                         ELSE 0" .
      "                       END isDurationUpdatable" .
      " FROM                  contest" .
      " JOIN                  betting" .
      "                       ON    contest.id = betting.contest_id" .
      " JOIN                  better" .
      "                       ON    betting.better_id = better.id" .
      " WHERE                 contest.startDate <= NOW()" .
      "                       AND   contest.endAdminDate >= NOW()" .
      "                       AND   better.accessKey = ?";

      $req = $db->prepare($query);
      $req->execute(array($accessKey));
      $res = $req->fetchAll(PDO::FETCH_ASSOC);
      if ($res[0]["isDurationUpdatable"] == 1) {
        return true;
      } else {
        return false;
      }
  }

	function isAccessKeyValid($db, $accessKey) {
    $query =
      " SELECT      CASE" .
      "                 WHEN    endAccessKeyValidityDate < NOW() AND better.isAdmin <> 1" .
      "                 THEN    0" .
      "                 ELSE    1" .
      "             END AS accessKeyValid" .
      " FROM        better" .
      " WHERE       better.accessKey = ?";

      $req = $db->prepare($query);
      $req->execute(array($accessKey));
      $res = $req->fetchAll(PDO::FETCH_ASSOC);
      if ($res && sizeof($res) && $res[0]["accessKeyValid"] == 1) {
        extendEndAccessValidityDate($db, $accessKey);
        return true;
      }

      return false;
	}

	function extendEndAccessValidityDate($db, $accessKey) {
		$query =
      " UPDATE      better" .
      " SET         better.endAccessKeyValidityDate = DATE_ADD(NOW(), INTERVAL 15 MINUTE)" .
      " WHERE       better.accessKey = ?";

      $req = $db->prepare($query);
      $req->execute(array($accessKey));
	}

	function generateAccessKey($input) {
		return password_hash($input, null);
	}

  function returnIsOffline() {
    echo json_encode(array("isOffline" => 1));
  }

  function returnIsNotUpdatable() {
    echo json_encode(array("isNotUpdatable" => 1));
  }
	
	// Connexion à la base de données
	try {
		header("Access-Control-Allow-Origin: *");
		header("Content-Type: application/json; charset=UTF-8");
		header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
    	header("Access-Control-Allow-Headers: Origin, Content-Type, X-Requested-With, Accept, Access-Control-Allow-Headers, Authorization");
    	header("Access-Control-Max-Age: 86400");

		// Access-Control headers are received during OPTIONS requests
		if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
			if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
				header("Access-Control-Allow-Methods: POST, DELETE, PUT, GET, PATCH, HEAD, OPTIONS");

			if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
				header("Access-Control-Allow-Headers: Origin, Content-Type, X-Requested-With, Accept, Access-Control-Allow-Headers, Authorization");
			return http_response_code(200);
		}
		if(substr($_SERVER['HTTP_HOST'], 0, 9) == 'localhost') {
			$db = new PDO('mysql:host=db;port=3306;dbname=cpi', 'root', 'Allezlom2014', array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
		} else {
			$db = new PDO('mysql:host=lepoulpeg.mysql.db;dbname=cpi', 'lepoulpeg', 'Allezlom2014', array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
		}
		if($db) {
			$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
	} catch(Exception $e) {
		die('Erreur de base de données : ' . $e->getMessage());
	}
?>