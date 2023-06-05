export interface IBetReviewOf {
  contestId: number;
  categoryId: number;
  contestLongName: string;
  categoryLongName: string;
  winnerPlayerName1: string;
  winnerPlayerName2: string;
  runnerUpPlayerName1: string;
  runnerUpPlayerName2: string;
  realWinnerPlayerName1: string;
  realWinnerPlayerName2: string;
  realRunnerUpPlayerName1: string;
  realRunnerUpPlayerName2: string;
  points: number;
  isCategoryDone: boolean;
}

export interface IBetReviewOfRaw {
  contest_id: number;
  category_id: number;
  contest_longName: string;
  category_longName: string;
  winner_playerName1: string;
  winner_playerName2: string;
  runnerUp_playerName1: string;
  runnerUp_playerName2: string;
  realWinner_playerName1: string;
  realWinner_playerName2: string;
  realRunnerUp_playerName1: string;
  realRunnerUp_playerName2: string;
  points: number;
  category_done: number;
}
