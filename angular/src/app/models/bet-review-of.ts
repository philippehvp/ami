import { IPlayerForReviewOf } from './player';

export interface IBetReviewOf {
  contestId: number;
  categoryId: number;
  contestLongName: string;
  categoryLongName: string;

  winnerPlayer: IPlayerForReviewOf;

  runnerUpPlayer: IPlayerForReviewOf;

  realWinnerPlayer: IPlayerForReviewOf;

  realRunnerUpPlayer: IPlayerForReviewOf;

  points: number;
  isCategoryDone: boolean;
}

export interface IBetReviewOfRaw {
  contest_id: number;
  category_id: number;
  contest_longName: string;
  category_longName: string;

  winner_playerName1: string;
  winner_playerNameOnly1: string;
  winner_playerRanking1: string;
  winner_playerClub1: string;

  winner_playerName2: string;
  winner_playerNameOnly2: string;
  winner_playerRanking2: string;
  winner_playerClub2: string;

  runnerUp_playerName1: string;
  runnerUp_playerNameOnly1: string;
  runnerUp_playerRanking1: string;
  runnerUp_playerClub1: string;

  runnerUp_playerName2: string;
  runnerUp_playerNameOnly2: string;
  runnerUp_playerRanking2: string;
  runnerUp_playerClub2: string;

  realWinner_playerName1: string;
  realWinner_playerNameOnly1: string;
  realWinner_playerRanking1: string;
  realWinner_playerClub1: string;

  realWinner_playerName2: string;
  realWinner_playerNameOnly2: string;
  realWinner_playerRanking2: string;
  realWinner_playerClub2: string;

  realRunnerUp_playerName1: string;
  realRunnerUp_playerNameOnly1: string;
  realRunnerUp_playerRanking1: string;
  realRunnerUp_playerClub1: string;

  realRunnerUp_playerName2: string;
  realRunnerUp_playerNameOnly2: string;
  realRunnerUp_playerRanking2: string;
  realRunnerUp_playerClub2: string;
  points: number;
  category_done: number;
}
