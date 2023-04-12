import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BetterPointActions } from '../action/better-point.action';
import { IBetterPoint } from 'src/app/models/point';
import { PointService } from 'src/app/services/rest/point.service';
import { tap } from 'rxjs';
import { IOffline } from 'src/app/models/utils';
import { ConnectionActions } from '../action/connection.action';
import { IBetterBet } from 'src/app/models/better-bet';
import { BetterService } from 'src/app/services/rest/better.service';
import { BetterBetActions } from '../action/better-bet';

export class BetterBetModel {
  betterBet!: IBetterBet | undefined;
}

@State<BetterBetModel>({
  name: 'betterBet',
  defaults: {
    betterBet: undefined,
  },
})
@Injectable()
export class BetterBetState {
  constructor(private betterService: BetterService) {}

  @Selector()
  static betterBet(state: BetterBetModel) {
    return state.betterBet;
  }

  @Action(BetterBetActions.GetBetterBet)
  getBetterBet(state: StateContext<BetterBetModel>) {
    return this.betterService.getBetterBet().pipe(
      tap((readBetterBets: IBetterBet | IOffline) => {
        if (readBetterBets && 'isOffline' in readBetterBets) {
          state.dispatch([new ConnectionActions.IsOffline()]);
        } else {
          state.patchState({
            betterBet: <IBetterBet>readBetterBets,
          });
        }
      })
    );
  }
}
