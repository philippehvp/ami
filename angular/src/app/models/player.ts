export interface IPlayer {
  id: number;
  categoryId: number;

  playerName1: string;
  playerNameOnly1: string;
  playerRanking1: string;
  playerClub1: string;

  playerName2: string;
  playerNameOnly2: string;
  playerRanking2: string;
  playerClub2: string;
}

export interface IPlayerForReviewOf {
  playerName1: string;
  playerNameOnly1: string;
  playerRanking1: string;
  playerClub1: string;

  playerName2: string;
  playerNameOnly2: string;
  playerRanking2: string;
  playerClub2: string;
}
