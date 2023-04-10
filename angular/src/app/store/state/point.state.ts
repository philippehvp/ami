import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { RankingActions } from '../action/point.action';
import { IBetterPoint } from 'src/app/models/point';
import { PointService } from 'src/app/services/rest/point.service';
import { tap } from 'rxjs';
import { IEmpty, IOffline } from 'src/app/models/utils';
import { ConnectionActions } from '../action/connection.action';

export class PointModel {
  categoryToDisplay!: number | undefined;
  betterPoints!: IBetterPoint[] | undefined;
}

@State<PointModel>({
  name: 'point',
  defaults: {
    categoryToDisplay: undefined,
    betterPoints: undefined,
  },
})
@Injectable()
export class PointState {
  constructor(private pointService: PointService) {}

  @Selector()
  static categoryToDisplay(state: PointModel) {
    return state.categoryToDisplay;
  }

  @Selector()
  static betterPoints(state: PointModel) {
    return state.betterPoints;
  }

  @Action(RankingActions.CategoryToDisplay)
  categoryToDisplay(
    state: StateContext<PointModel>,
    action: RankingActions.CategoryToDisplay
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
