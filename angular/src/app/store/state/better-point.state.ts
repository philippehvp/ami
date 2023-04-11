import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BetterPointActions } from '../action/better-point.action';
import { IBetterPoint } from 'src/app/models/point';
import { PointService } from 'src/app/services/rest/point.service';
import { tap } from 'rxjs';
import { IOffline } from 'src/app/models/utils';
import { ConnectionActions } from '../action/connection.action';

export class BetterPointModel {
  categoryToDisplay!: number | undefined;
  betterPoints!: IBetterPoint[] | undefined;
}

@State<BetterPointModel>({
  name: 'point',
  defaults: {
    categoryToDisplay: undefined,
    betterPoints: undefined,
  },
})
@Injectable()
export class BetterPointState {
  constructor(private pointService: PointService) {}

  @Selector()
  static categoryToDisplay(state: BetterPointModel) {
    return state.categoryToDisplay;
  }

  @Selector()
  static betterPoints(state: BetterPointModel) {
    return state.betterPoints;
  }

  @Action(BetterPointActions.CategoryToDisplay)
  categoryToDisplay(
    state: StateContext<BetterPointModel>,
    action: BetterPointActions.CategoryToDisplay
  ) {
    return this.pointService.getBetterPoints(action.categoryId).pipe(
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
