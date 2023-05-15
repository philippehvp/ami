export interface IBetReview {
  contestId: number;
  categoryId: number;
  categoryShortName: string;
  winnerPlayerName1: string;
  winnerPlayerName2: string;
  runnerUpPlayerName1: string;
  runnerUpPlayerName2: string;
}

export interface IBetReviewRaw {
  contest_id: number;
  category_id: number;
  categoryShortName: string;
  winner_playerName1: string;
  winner_playerName2: string;
  runnerUp_playerName1: string;
  runnerUp_playerName2: string;
}
