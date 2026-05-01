import { Injectable } from '@angular/core';
import { IPair, PAIR_ALIAS } from '../models/pair';

export enum COURT_MODE {
  LEFT_RIGHT = 0,
  UP_DOWN = 1,
}

@Injectable({
  providedIn: 'root',
})
export class PlayerOnCourtService {
  private _courtMode: COURT_MODE | undefined = undefined;

  private _playersName: string[] = [];

  private _firstSetLeftPair!: PAIR_ALIAS;
  private _firstSetRightPair!: PAIR_ALIAS;

  private _secondSetLeftPair!: PAIR_ALIAS;
  private _secondSetRightPair!: PAIR_ALIAS;

  private _thirdSetLeftPair!: PAIR_ALIAS;
  private _thirdSetRightPair!: PAIR_ALIAS;

  public getCourtMode(): COURT_MODE | undefined {
    return this._courtMode;
  }

  public setCourtMode(courtMode: COURT_MODE) {
    this._courtMode = courtMode;
  }

  public setPlayersName(playersName: string[]) {
    this._playersName = playersName;
  }

  public getPlayerName(playerNumber: number): string {
    return this._playersName[playerNumber - 1];
  }

  public setFirstSetLeftPair(pairAlias: PAIR_ALIAS) {
    this._firstSetLeftPair = pairAlias;
  }

  public setFirstSetRightPair(pairAlias: PAIR_ALIAS) {
    this._firstSetRightPair = pairAlias;
  }

  public getFirstSetLeftPair(): PAIR_ALIAS {
    return this._firstSetLeftPair;
  }

  public getFirstSetRightPair(): PAIR_ALIAS {
    return this._firstSetRightPair;
  }

  public setSecondSetLeftPair(pairAlias: PAIR_ALIAS) {
    this._secondSetLeftPair = pairAlias;
  }

  public setSecondSetRightPair(pairAlias: PAIR_ALIAS) {
    this._secondSetRightPair = pairAlias;
  }

  public getSecondSetLeftPair(): PAIR_ALIAS {
    return this._secondSetLeftPair;
  }

  public getSecondSetRightPair(): PAIR_ALIAS {
    return this._secondSetRightPair;
  }

  public setThirdSetLeftPair(pairAlias: PAIR_ALIAS) {
    this._thirdSetLeftPair = pairAlias;
  }

  public setThirdSetRightPair(pairAlias: PAIR_ALIAS) {
    this._thirdSetRightPair = pairAlias;
  }

  public getThirdSetLeftPair(): PAIR_ALIAS {
    return this._thirdSetLeftPair;
  }

  public getThirdSetRightPair(): PAIR_ALIAS {
    return this._thirdSetRightPair;
  }
}
