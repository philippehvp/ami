import { Injectable, ModelSignal } from '@angular/core';

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

  public static isMatchLaunchable(
    server: number | undefined,
    receiver: number | undefined,
    serverSide: number | undefined,
  ): boolean {
    const allFieldsFilled: boolean =
      server !== undefined &&
      receiver !== undefined &&
      serverSide !== undefined;

    if (allFieldsFilled) {
      // Tous les champs sont remplis, à voir si le choix des joueurs est cohérent
      const correctChoice: boolean =
        ((server === 1 || server === 2) &&
          (receiver === 3 || receiver === 4)) ||
        ((server === 3 || server === 4) && (receiver === 1 || receiver === 2));

      return correctChoice;
    }

    return false;
  }

  public static isSetLaunchable(
    server: number | undefined,
    receiver: number | undefined,
  ): boolean {
    const allFieldsFilled: boolean =
      server !== undefined && receiver !== undefined;

    if (allFieldsFilled) {
      // Tous les champs sont remplis, à voir si le choix des joueurs est cohérent
      const correctChoice: boolean =
        ((server === 1 || server === 2) &&
          (receiver === 3 || receiver === 4)) ||
        ((server === 3 || server === 4) && (receiver === 1 || receiver === 2));

      return correctChoice;
    }

    return false;
  }
}
