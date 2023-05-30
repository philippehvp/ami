<?php
	session_start();

	const VALIDITY_DURATION = 15;
	
	function getContestStartDate($db, $contest) {
		$query =
			"   SELECT        cpi_contest.startDate" .
			"   FROM          cpi_contest" .
			"   WHERE         cpi_contest.id = ?";
		
		$req = $db->prepare($query);
    $req->execute(array($contest));
		$res = $req->fetchAll(PDO::FETCH_ASSOC);
		return new DateTime($res[0]["startDate"]);
	}

	function getContestEndDate($db, $contest, $accessKey) {
		$query =
			"   SELECT        CASE" .
      "                   WHEN cpi_better.isAdmin = 1 THEN cpi_contest.endAdminDate" .
      "                   ELSE cpi_contest.endBetDate" .
      "                 END AS endDate" .
			"   FROM          cpi_contest" .
      "   JOIN          cpi_betting" .
      "                 ON    cpi_contest.id = cpi_betting.contest_id" .
      "   JOIN          cpi_better" .
      "                 ON    cpi_betting.better_id = cpi_better.id" .
			"   WHERE         cpi_contest.id = ?" .
      "                 AND   cpi_better.accessKey = ?";
		
    $req = $db->prepare($query);
    $req->execute(array($contest, $accessKey));
		$res = $req->fetchAll(PDO::FETCH_ASSOC);
		return new DateTime($res[0]["endDate"]);
	}

	function isUpdatable($db, $contest, $accessKey) {
    $query =
      " SELECT    CASE" .
      "               WHEN    cpi_contest.startDate <= NOW()" .
      "                       AND   NOW() <=" .
      "                             CASE    WHEN    cpi_better.isAdmin = 1" .
      "                                     THEN    cpi_contest.endAdminDate" .
      "                                     ELSE    cpi_contest.endBetDate" .
      "                             END" .
      "               THEN    1" .
      "               ELSE    0" .
      "           END AS isUpdatable" .
      " FROM      cpi_contest" .
      " JOIN      cpi_betting" .
      "           ON    cpi_contest.id = cpi_betting.contest_id" .
      " JOIN      cpi_better" .
      "           ON    cpi_betting.better_id = cpi_better.id" .
      " WHERE     cpi_contest.id = ?" .
      "           AND   cpi_better.accessKey = ?";

    $req = $db->prepare($query);
    $req->execute(array($contest, $accessKey));
    $res = $req->fetchAll(PDO::FETCH_ASSOC);
    if ($res && sizeof($res)) {
      return $res[0]["isUpdatable"] == 1;
    }

    return false;
	}

  function isDurationUpdatableOrBetsErasable($db, $accessKey) {
    $query =
      " SELECT DISTINCT       CASE" .
      "                         WHEN cpi_better.isAdmin = 1 AND cpi_contest.startDate <= NOW() AND NOW() <= cpi_contest.endAdminDate THEN 1" .
      "                         WHEN cpi_better.isAdmin = 0 AND cpi_contest.startDate <= NOW() AND NOW() <= cpi_contest.endBetDate THEN 1" .
      "                         ELSE 0" .
      "                       END isActionPossible" .
      " FROM                  cpi_contest" .
      " JOIN                  cpi_betting" .
      "                       ON    cpi_contest.id = cpi_betting.contest_id" .
      " JOIN                  cpi_better" .
      "                       ON    cpi_betting.better_id = cpi_better.id" .
      " WHERE                 cpi_contest.startDate <= NOW()" .
      "                       AND   cpi_contest.endAdminDate >= NOW()" .
      "                       AND   cpi_better.accessKey = ?";

      $req = $db->prepare($query);
      $req->execute(array($accessKey));
      $res = $req->fetchAll(PDO::FETCH_ASSOC);
      if ($res[0]["isActionPossible"] == 1) {
        return true;
      } else {
        return false;
      }

  }

  function isDurationUpdatable($db, $accessKey) {
    return isDurationUpdatableOrBetsErasable($db, $accessKey);
  }

  function isBetsErasable($db, $accessKey) {
    return isDurationUpdatableOrBetsErasable($db, $accessKey);
  }

	function isAccessKeyValid($db, $accessKey) {
    $query =
      " SELECT      CASE" .
      "                 WHEN    cpi_better.endAccessKeyValidityDate < NOW()" .
      "                 THEN    0" .
      "                 ELSE    1" .
      "             END AS accessKeyValid" .
      " FROM        cpi_better" .
      " WHERE       cpi_better.accessKey = ?";

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
      " UPDATE      cpi_better" .
      " SET         cpi_better.endAccessKeyValidityDate = fn_connection_validity()" .
      " WHERE       cpi_better.accessKey = ?";

      $req = $db->prepare($query);
      $req->execute(array($accessKey));
	}

	function generateAccessKey($input) {
		return password_hash($input, PASSWORD_DEFAULT);
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
			$db = new PDO('mysql:host=istresspruisb.mysql.db;dbname=istresspruisb', 'istresspruisb', 'Istripotes13800', array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
		}
		if($db) {
			$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
	} catch(Exception $e) {
		die('Erreur de base de données : ' . $e->getMessage());
	}
?>