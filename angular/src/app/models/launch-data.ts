import { IPlayer } from './player';
import { IPlayerPosition } from './player-position';
import { SERVER_SIDE } from './point';

export interface ILaunchData {
  player1: IPlayer;
  player2: IPlayer;
}

export interface IFirstPoint {
  pointTeamLeft: number;
  pointTeamRight: number;

  playerPositionLeftTeam: IPlayerPosition;
  playerPositionRightTeam: IPlayerPosition;

  serverSide: SERVER_SIDE;
}
