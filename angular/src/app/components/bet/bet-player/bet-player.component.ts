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

  @Select(BetState.isLoadingData)
  isLoadingData$!: Observable<boolean>;

  public withClubName: boolean = true;

  public displayedColumns: string[] = ['winner', 'runnerUp', 'name'];

  public isWinnerChecked(
    currentBet: IBet | undefined,
    playerId: number
  ): boolean {
    return playerId === currentBet?.winnerId;
  }

  public isRunnerUpChecked(
    currentBet: IBet | undefined,
    playerId: number
  ): boolean {
    return playerId === currentBet?.runnerUpId;
  }

  public winnerIconLabel(
    currentBet: IBet | undefined,
    playerId: number
  ): string {
    if (this.isWinnerChecked(currentBet, playerId)) {
      return 'expand_circle_down';
    }
    return 'radio_button_unchecked';
  }

  public runnerUpIconLabel(
    currentBet: IBet | undefined,
    playerId: number
  ): string {
    if (this.isRunnerUpChecked(currentBet, playerId)) {
      return 'expand_circle_down';
    }
    return 'radio_button_unchecked';
  }

  public changeWinner(playerId: number) {
    this.store.dispatch([new BetActions.SetWinner(playerId)]);
  }

  public changeRunnerUp(playerId: number) {
    this.store.dispatch([new BetActions.SetRunnerUp(playerId)]);
  }

  public firstPlayerName(player: IPlayer): string {
    let ret: string = player.playerRanking1 + ' - ' + player.playerName1;
    if (this.withClubName) {
      ret += ' (' + player.playerClub1 + ')';
    }

    return ret;
  }

  public secondPlayerName(player: IPlayer): string {
    let ret: string = player.playerRanking2 + ' - ' + player.playerName2;
    if (this.withClubName) {
      ret += ' (' + player.playerClub2 + ')';
    }

    return ret;
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
