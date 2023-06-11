export interface IHeader {
  contestName: string;
  categoryName: string;
}

export interface IPlayer {
  playerNameOnly1: string;
  playerNameOnly2: string;
}

export interface IPlayerBet {
  name: string;
  club: string;
  winners: IPlayer[];
  runnersUp: IPlayer[];
  duration: number;
}

export interface IBetterBet {
  header: IHeader[];
  bets: IPlayerBet[];
}
