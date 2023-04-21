import { Component, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { IPlayer } from 'src/app/models/player';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetterPointActions } from 'src/app/store/action/better-point.action';
import { BetState } from 'src/app/store/state/bet.state';
// import {
//   animate,
//   state,
//   style,
//   transition,
//   trigger,
// } from '@angular/animations';

// const fadeOutIn = trigger('fadeOutIn', [
//   state(
//     'loading',
//     style({
//       color: '#fff',
//       backgroundColor: '#5a246a',
//     })
//   ),
//   state(
//     'loadComplete',
//     style({
//       color: 'inherit',
//       backgroundColor: 'inherit',
//     })
//   ),
//   transition('loading => loadComplete', [animate('1s')]),
//   transition('loadComplete => loading', [animate('0.5s ease-out')]),
// ]);

@Component({
  selector: 'bet-player',
  templateUrl: './bet-player.component.html',
  styleUrls: ['./bet-player.component.scss'],
  // animations: [fadeOutIn],
})
export class BetPlayerComponent {
  private store = inject(Store);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.currentBet)
  currentBet$!: Observable<IBet>;

  @Select(BetState.contest)
  contest$!: Observable<IContest>;

  @Select(BetState.category)
  category$!: Observable<ICategory>;

  @Select(BetState.players)
  players$!: Observable<IPlayer[]>;

  @Select(BetState.isLoadingPlayer)
  isLoadingPlayer$!: Observable<boolean>;

  public displayedColumns: string[] = ['winner', 'runnerUp', 'name'];

  public isChecked(
    currentBet: IBet | undefined,
    playerId: number,
    isFocusedOnWinner: boolean
  ): boolean {
    if (currentBet) {
      if (isFocusedOnWinner) {
        return playerId === currentBet?.winnerId ? true : false;
      } else {
        return playerId === currentBet?.runnerUpId ? true : false;
      }
    }

    return false;
  }

  public iconLabel(
    currentBet: IBet | undefined,
    playerId: number,
    isFocusedOnWinner: boolean
  ): string {
    if (this.isChecked(currentBet, playerId, isFocusedOnWinner)) {
      return 'expand_circle_down';
    }
    return 'radio_button_unchecked';
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

  public gotoNextCategory(currentBet: IBet | undefined) {
    if (currentBet) {
      this.store.dispatch([
        new BetActions.GotoNextCategory(currentBet.categoryId),
      ]);
    }
  }

  public calculate(better: IBetter | undefined, currentBet: IBet | undefined) {
    this.store
      .dispatch([new BetActions.CalculatePointsAndRanking()])
      .subscribe(() => {
        this.store.dispatch([
          new BetterPointActions.GetBetterPoint(
            better?.accessKey || '',
            currentBet?.categoryId || 0
          ),
        ]);
      });
  }
}
