import { IPair } from './pair';
import { IPlayerPosition } from './player-position';
import { SERVER_SIDE } from './point';

export interface ILaunchMatchData {
  leftPair: IPair;
  rightPair: IPair;
}

export interface ILaunchSetData {
  isPlayer1Or2AsServer: boolean;
  isPlayer3Or4AsServer: boolean;

  serverSide: SERVER_SIDE;
}

export interface IFirstPoint {
  pointLeftPair: number;
  pointRightPair: number;

  playerPositionLeftPair: IPlayerPosition;
  playerPositionRightPair: IPlayerPosition;

  serverSide: SERVER_SIDE;
}
