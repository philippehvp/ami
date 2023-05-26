export interface IHeader {
  contestName: string;
  categoryName: string;
}

export interface IPlayer {
  playerName1: string;
  playerName2: string;
}

export interface IPlayerBet {
  name: string;
  winners: IPlayer[];
  runnersUp: IPlayer[];
  duration: number;
}

export interface IBetterBet {
  header: IHeader[];
  bets: IPlayerBet[];
}

export interface IPlayerOfCategory {
  players: IPlayer[];
  duration?: number;
}

export interface IDisplayedBetterBet {
  rows: IPlayerOfCategory[];
}
