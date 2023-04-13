import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BetterPointActions } from '../action/better-point.action';
import { IBetterPoint } from 'src/app/models/better-point';
import { BetterPointService } from 'src/app/services/rest/better-point.service';
import { tap } from 'rxjs';
import { IOffline } from 'src/app/models/utils';
import { ConnectionActions } from '../action/connection.action';

export class BetterPointModel {
  categoryToDisplay!: number | undefined;
  betterPoints!: IBetterPoint[] | undefined;
}

@State<BetterPointModel>({
  name: 'betterPoint',
  defaults: {
    categoryToDisplay: undefined,
    betterPoints: undefined,
  },
})
@Injectable()
export class BetterPointState {
  constructor(private pointService: BetterPointService) {}

  @Selector()
  static categoryToDisplay(state: BetterPointModel) {
    return state.categoryToDisplay;
  }

  @Selector()
  static betterPoints(state: BetterPointModel) {
    return state.betterPoints;
  }

  @Action(BetterPointActions.GetBetterPoint)
  categoryToDisplay(
    state: StateContext<BetterPointModel>,
    action: BetterPointActions.GetBetterPoint
  ) {
    return this.pointService
      .getBettersPoints(action.accessKey, action.categoryId)
      .pipe(
        tap((readBetterPoints: IBetterPoint[] | IOffline) => {
          if (readBetterPoints && 'isOffline' in readBetterPoints) {
            state.dispatch([new ConnectionActions.IsOffline()]);
          } else {
            state.patchState({
              categoryToDisplay: action.categoryId,
              betterPoints: <IBetterPoint[]>readBetterPoints,
            });
          }
        })
      );
  }
}
