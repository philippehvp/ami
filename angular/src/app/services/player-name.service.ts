import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlayerNameService {
  private _playersName: string[] = [];

  public setPlayersName(playersName: string[]) {
    this._playersName = playersName;
  }

  public getPlayerName(index: number): string {
    return this._playersName[index - 1];
  }
}
