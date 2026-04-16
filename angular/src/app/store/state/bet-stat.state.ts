import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { IOffline } from '../../models/utils';
import { ConnectionActions } from '../action/connection.action';
import { IBetStat } from '../../models/bet-stat';
import { BetStatActions } from '../action/bet-stat.action';
import { BetStatService } from '../../services/rest/bet-stat.service';

export class BetStatModel {
  betStat!: IBetStat[] | undefined;
}

@State<BetStatModel>({
  name: 'betStat',
  defaults: {
    betStat: undefined,
  },
})
@Injectable()
export class BetStatState {
  constructor(private statService: BetStatService) {}

  @Selector()
  static betStat(state: BetStatModel) {
    return state.betStat;
  }

  @Action(BetStatActions.GetBetStat)
  getBetStat(
    state: StateContext<BetStatModel>,
    action: BetStatActions.GetBetStat,
  ) {
    return this.statService.getBetStat(action.accessKey).pipe(
      tap((readBetStat: IBetStat[] | IOffline) => {
        if (readBetStat && 'isOffline' in readBetStat) {
          state.dispatch([new ConnectionActions.IsOffline()]);
        } else {
          state.patchState({
            betStat: <IBetStat[]>readBetStat,
          });
        }
      }),
    );
  }
}
