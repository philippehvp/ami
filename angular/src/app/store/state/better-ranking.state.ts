import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { IOffline } from 'src/app/models/utils';
import { ConnectionActions } from '../action/connection.action';
import { IBetterRanking } from 'src/app/models/better-ranking';
import { BetterRankingActions } from '../action/better-ranking.action';
import { BetterRankingService } from 'src/app/services/rest/better-ranking.service';

export class BetterRankingModel {
  bettersRanking!: IBetterRanking[] | undefined;
}

@State<BetterRankingModel>({
  name: 'betterRanking',
  defaults: {
    bettersRanking: undefined,
  },
})
@Injectable()
export class BetterRankingState {
  constructor(private rankingService: BetterRankingService) {}

  @Selector()
  static bettersRanking(state: BetterRankingModel) {
    return state.bettersRanking;
  }

  @Action(BetterRankingActions.GetBetterRanking)
  getBetterRanking(
    state: StateContext<BetterRankingModel>,
    action: BetterRankingActions.GetBetterRanking
  ) {
    return this.rankingService
      .getBettersRanking(action.accessKey, action.byRanking)
      .pipe(
        tap((readBettersRanking: IBetterRanking[] | IOffline) => {
          if (readBettersRanking && 'isOffline' in readBettersRanking) {
            state.dispatch([new ConnectionActions.IsOffline()]);
          } else {
            state.patchState({
              bettersRanking: <IBetterRanking[]>readBettersRanking,
            });
          }
        })
      );
  }
}
