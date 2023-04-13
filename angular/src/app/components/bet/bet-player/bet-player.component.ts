import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/internal/operators/filter';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { IPlayer } from 'src/app/models/player';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetterPointActions } from 'src/app/store/action/better-point.action';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'bet-player',
  templateUrl: './bet-player.component.html',
  styleUrls: ['./bet-player.component.scss'],
})
export class BetPlayerComponent implements OnInit, OnDestroy {
  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.players)
  players$!: Observable<IPlayer[]>;

  @Select(BetState.currentBet)
  currentBet$!: Observable<IBet>;

  @Select(BetState.contest)
  contest$!: Observable<IContest>;

  @Select(BetState.category)
  category$!: Observable<ICategory>;

  public displayedColumns: string[];

  private currentBet!: IBet;

  private betterSub!: Subscription;
  private currentBetSub!: Subscription;

  private better!: IBetter;

  public isChecked(playerId: number, isFocusedOnWinner: boolean): boolean {
    if (isFocusedOnWinner) {
      return playerId === this.currentBet?.winnerId ? true : false;
    } else {
      return playerId === this.currentBet?.runnerUpId ? true : false;
    }
  }

  public iconLabel(playerId: number, isFocusedOnWinner: boolean): string {
    if (this.isChecked(playerId, isFocusedOnWinner)) {
      return 'expand_circle_down';
    }
    return 'radio_button_unchecked';
  }

  constructor(private store: Store) {
    this.displayedColumns = ['winner', 'runnerUp', 'name'];
  }

  public ngOnInit() {
    this.currentBetSub = this.currentBet$
      ?.pipe(filter((bet) => !!bet))
      .subscribe((bet) => {
        this.currentBet = bet;
      });

    this.betterSub = this.better$
      .pipe(filter((better) => !!better))
      .subscribe((better) => (this.better = better));
  }

  public ngOnDestroy() {
    if (this.currentBetSub) {
      this.currentBetSub.unsubscribe();
    }

    if (this.betterSub) {
      this.betterSub.unsubscribe();
    }
  }

  public changePlayer(playerId: number, isFocusedOnWinner: boolean) {
    if (isFocusedOnWinner) {
      this.store.dispatch([new BetActions.SetWinner(playerId)]);
    } else {
      this.store.dispatch([new BetActions.SetRunnerUp(playerId)]);
    }
  }

  public label(player: IPlayer, isFocusedOnWinner: boolean): string {
    if (isFocusedOnWinner) {
      if (player.playerRanking1) {
        return '(' + player.playerRanking1 + ') ' + player.playerName1;
      } else {
        return player.playerName1;
      }
    } else {
      if (player.playerRanking2) {
        return '(' + player.playerRanking2 + ') ' + player.playerName2;
      } else {
        return player.playerName2;
      }
    }
  }

  public calculate() {
    this.store
      .dispatch([new BetActions.CalculatePointsAndRanking()])
      .subscribe(() => {
        this.store.dispatch([
          new BetterPointActions.GetBetterPoint(
            this.better.accessKey,
            this.currentBet.categoryId
          ),
        ]);
      });
  }
}
