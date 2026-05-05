import { Injectable } from '@angular/core';
import {
  FIRST_SET_ID,
  SECOND_SET_ID,
  THIRD_SET_ID,
  VIEW_MODE,
} from '../models/constants';

@Injectable({
  providedIn: 'root',
})
export class ViewModeService {
  private _viewMode: VIEW_MODE = VIEW_MODE.LIVE;

  public get isLiveMode(): boolean {
    return this._viewMode === VIEW_MODE.LIVE;
  }

  public get isFirstSetHistoricMode(): boolean {
    return this.isHistoricMode(1);
  }

  public get isSecondSetHistoricMode(): boolean {
    return this.isHistoricMode(2);
  }

  public get isThirdSetHistoricMode(): boolean {
    return this.isHistoricMode(3);
  }

  private isHistoricMode(setId: number): boolean {
    if (
      setId === FIRST_SET_ID &&
      this._viewMode === VIEW_MODE.HISTORIC_FIRST_SET
    ) {
      return true;
    } else if (
      setId === SECOND_SET_ID &&
      this._viewMode === VIEW_MODE.HISTORIC_SECOND_SET
    ) {
      return true;
    } else if (
      setId === THIRD_SET_ID &&
      this._viewMode === VIEW_MODE.HISTORIC_THIRD_SET
    ) {
      return true;
    }
    return false;
  }
}
