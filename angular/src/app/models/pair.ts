export interface IPair {
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

export enum PAIR_ALIAS {
  ONE_TWO = 0,
  THREE_FOUR = 1,
}
