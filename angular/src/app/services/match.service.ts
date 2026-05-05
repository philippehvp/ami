import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private _isMatchedLaunched = false;

  public get isMatchLaunched(): boolean {
    return this._isMatchedLaunched;
  }

  public set isMatchLaunched(isMatchLaunched: boolean) {
    this._isMatchedLaunched = isMatchLaunched;
  }
}
