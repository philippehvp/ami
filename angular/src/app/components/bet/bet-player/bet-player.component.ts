import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Subscription, combineLatest, map } from 'rxjs';

const fadeAnimation = trigger('fadeAnimation', [
  state(
    'hide',
    style({
      opacity: 0,
    })
  ),
  state(
    'show',
    style({
      opacity: 1,
    })
  ),
  transition('* => hide', [animate('0.25s')]),
  transition('* => show', [animate('1s')]),
]);

@Component({
  selector: 'bet-player',
  templateUrl: './bet-player.component.html',
  styleUrls: ['./bet-player.component.scss'],
  animations: [fadeAnimation],
})
export class BetPlayerComponent implements OnInit, OnDestroy {
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

  public playersDisplayed!: IPlayer[];
  public playersReceived!: IPlayer[];

  public headerLabelReceived!: string;
  public headerLabelDisplayed!: string;

  private subs!: Subscription;

  public isHiding!: boolean;
  private isLoadingData!: boolean;

  public displayedColumns: string[] = ['winner', 'runnerUp', 'name'];

  public get withClubName(): boolean {
    return this.persistenceService.withClubName;
  }

  public set withClubName(withClubName: boolean) {
    this.persistenceService.withClubName = withClubName;
  }

  public ngOnInit() {
    this.subs = combineLatest([
      this.contest$,
      this.category$,
      this.isLoadingData$,
      this.players$,
    ])
      .pipe(
        map(([contest, category, isLoadingData, players]) => {
          // La variable isLoadingData reflète toujours l'état de chargement ou non des données
          this.isLoadingData = isLoadingData;

          // On pilote manuellement le fait de masquer ou d'afficher les données
          if (isLoadingData) {
            // On déclenche le masquage des données
            this.isHiding = true;
          }

          if (contest && category) {
            this.headerLabelReceived =
              contest.longName + ' - ' + category.longName;
          }

          this.playersReceived = players;

          if (!this.playersDisplayed) {
            // Dans le cas où on a affiché une autre page et que l'on revient, on force le chargement des joueurs
            this.headerLabelDisplayed =
              contest.longName + ' - ' + category.longName;
            this.playersDisplayed = players;
          }
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

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

  public animationDone($event: any) {
    // On vient de finir une animation qui peut-être le masquage ou l'affichage des données
    if ($event.toState === 'hide') {
      if (this.isLoadingData === false) {
        // Si on vient de finir de masquer les données et que les données sont chargées
        // Alors on doit les faire apparaître
        this.playersDisplayed = this.playersReceived;
        this.headerLabelDisplayed = this.headerLabelReceived;
        this.isHiding = false;
      } else {
        // while (this.isLoadingData === true) {
        //   setTimeout(() => {}, 1000);
        // }
        // this.playersDisplayed = this.playersReceived;
        this.isHiding = false;
      }
    }
  }
}
