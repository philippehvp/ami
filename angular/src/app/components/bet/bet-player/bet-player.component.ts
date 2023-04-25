import { Component, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { IPlayer } from 'src/app/models/player';
import { PersistenceServiceService as PersistenceService } from 'src/app/services/persistence.service';
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
  private persistenceService = inject(PersistenceService);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.bet)
  bet$!: Observable<IBet>;

  @Select(BetState.contest)
  contest$!: Observable<IContest>;

  @Select(BetState.category)
  category$!: Observable<ICategory>;

  @Select(BetState.players)
  players$!: Observable<IPlayer[]>;

  @Select(BetState.isLoadingData)
  isLoadingData$!: Observable<boolean>;

  public displayedColumns: string[] = ['winner', 'runnerUp', 'name'];

  public get withClubName(): boolean {
    return this.persistenceService.withClubName;
  }

  public set withClubName(withClubName: boolean) {
    this.persistenceService.withClubName = withClubName;
  }

  constructor() {}

  public isWinnerChecked(bet: IBet | undefined, playerId: number): boolean {
    return playerId === bet?.winnerId;
  }

  public isRunnerUpChecked(bet: IBet | undefined, playerId: number): boolean {
    return playerId === bet?.runnerUpId;
  }

  public winnerIconLabel(bet: IBet | undefined, playerId: number): string {
    if (this.isWinnerChecked(bet, playerId)) {
      return 'expand_circle_down';
    }
    return 'radio_button_unchecked';
  }

  public runnerUpIconLabel(bet: IBet | undefined, playerId: number): string {
    if (this.isRunnerUpChecked(bet, playerId)) {
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
    return player.playerName1;
  }

  public secondPlayerName(player: IPlayer): string {
    return player.playerName2;
  }

  public firstPlayerRanking(player: IPlayer): string {
    return player.playerRanking1;
  }

  public secondPlayerRanking(player: IPlayer): string {
    return player.playerRanking2;
  }

  public firstPlayerClub(player: IPlayer): string {
    return player.playerClub1;
  }

  public secondPlayerClub(player: IPlayer): string {
    return player.playerClub2;
  }

  public gotoNextCategory(bet: IBet | undefined) {
    if (bet) {
      this.store.dispatch([new BetActions.GotoNextCategory(bet.categoryId)]);
    }
  }

  public calculate(better: IBetter | undefined, bet: IBet | undefined) {
    this.store
      .dispatch([new BetActions.CalculatePointsAndRanking()])
      .subscribe(() => {
        this.store.dispatch([
          new BetterPointActions.GetBetterPoint(
            better?.accessKey || '',
            bet?.categoryId || 0
          ),
        ]);
      });
  }
}
