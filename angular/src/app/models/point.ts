import { IPlayerPosition } from './player-position';

export enum SERVER_SIDE {
  LEFT = 1,
  RIGHT = 2,
}

export interface IPoint {
  pointLeftPair: number;
  pointRightPair: number;

  playerPositionLeftPair: IPlayerPosition;
  playerPositionRightPair: IPlayerPosition;

  serverSide: SERVER_SIDE;
}
