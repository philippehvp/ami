DELIMITER ;;
DROP FUNCTION fn_calculate_points;
CREATE FUNCTION fn_calculate_points(
    p_truth_winner INT,
    p_truth_runnerUp INT,
    p_bet_winner INT,
    p_bet_runnerUp INT
    ) RETURNS int(11)
    READS SQL DATA
    DETERMINISTIC
BEGIN
    DECLARE     l_points INT;

    SET         l_points =
                    CASE
                        WHEN p_truth_winner = p_bet_winner AND p_truth_runnerUp = p_bet_runnerUp THEN 20
                        WHEN p_truth_winner = p_bet_winner AND p_truth_runnerUp <> p_bet_runnerUp THEN 12
                        WHEN p_truth_winner = p_bet_runnerUp AND p_truth_runnerUp = p_bet_winner THEN 10
                        WHEN p_truth_winner <> p_bet_winner AND p_truth_runnerUp = p_bet_runnerUp THEN 7
                        WHEN p_truth_winner = p_bet_runnerUp OR p_truth_runnerUp = p_bet_winner THEN 5
                        ELSE 0
                    END;

    RETURN l_points;


END;