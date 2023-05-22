import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { IOffline } from 'src/app/models/utils';
import { ConnectionActions } from '../action/connection.action';
import { IBetterBet } from 'src/app/models/better-bet';
import { BetActions } from '../action/bet.action';
import { BetService } from 'src/app/services/rest/bet.service';

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
  private betService = inject(BetService);

  @Selector()
  static betterBet(state: BetterBetModel) {
    return state.betterBet;
  }

  @Action(BetActions.GetBetterBet)
  getBetterBet(
    state: StateContext<BetterBetModel>,
    action: BetActions.GetBetterBet
  ) {
    return this.betService.getBetterBet(action.accessKey).pipe(
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
