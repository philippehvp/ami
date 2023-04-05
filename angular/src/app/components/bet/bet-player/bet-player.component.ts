import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/internal/operators/filter';
import { IBet } from 'src/app/models/bet';
import { IPlayer } from 'src/app/models/player';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'bet-player',
  templateUrl: './bet-player.component.html',
  styleUrls: ['./bet-player.component.scss']
})
export class BetPlayerComponent implements OnInit, OnDestroy {
  @Select(BetState.players)
  players$: Observable<IPlayer[]> | undefined;

  @Select(BetState.currentBet)
  currentBet$: Observable<IBet> | undefined;

  public displayedColumns: string[] | undefined;

  private currentBet: IBet | undefined;

  private currentBetSub: Subscription | undefined;

  public isChecked(playerId: number, isFocusedOnWinner: boolean): boolean {
    if (isFocusedOnWinner) {
      return playerId === this.currentBet?.winnerId ? true : false;
    } else {
      return playerId === this.currentBet?.runnerUpId ? true : false;
    }
  }

  constructor(private store: Store) {
    this.displayedColumns = ['winner', 'runnerUp', 'name'];
  }

  public ngOnInit() {
    this.currentBetSub = this.currentBet$?.pipe(filter(bet => !!bet)).subscribe(bet => {
      this.currentBet = bet;
    });
  }

  public ngOnDestroy() {
    if (this.currentBetSub) {
      this.currentBetSub.unsubscribe();
    }
  }

  public changePlayer(playerId: number, isFocusedOnWinner: boolean) {
    if (isFocusedOnWinner) {
      this.store.dispatch([new BetActions.SetWinner(playerId)]);
    } else {
      this.store.dispatch([new BetActions.SetRunnerUp(playerId)]);
    }
  }


}
