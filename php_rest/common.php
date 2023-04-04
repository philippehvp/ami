<?php
	session_start();
	
	function getContestStartDate($db, $contest) {
		$query =
			"   SELECT        contest.startDate" .
			"   FROM          contest" .
			"   WHERE         contest.id = " . $contest;
		
		$req = $db->query($query);
		$res = $req->fetchAll(PDO::FETCH_ASSOC);
		return new DateTime($res[0]["startDate"]);
	}

	function getContestEndDate($db, $contest) {
		$query =
			"   SELECT        contest.endDate" .
			"   FROM          contest" .
			"   WHERE         contest.id = " . $contest;
		
		$req = $db->query($query);
		$res = $req->fetchAll(PDO::FETCH_ASSOC);
		return new DateTime($res[0]["endDate"]);
	}

	function isUpdatable($db, $contest, $isAdmin) {
		if ($isAdmin) {
			return true;
		}
		
	    $contestStartDate = getContestStartDate($db, $contest);
		$contestEndDate = getContestEndDate($db, $contest);

    	$contestStartDateTS = $contestStartDate ? $contestStartDate->getTimestamp() : 0;
		$contestEndDateTS = $contestEndDate ? $contestEndDate->getTimestamp() : 0;

    	$now = new DateTime();
    	$nowTS = $now ? $now->getTimestamp() : 1;

		return $contestStartDateTS <= $nowTS && $nowTS <= $contestEndDateTS ? true : false;
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