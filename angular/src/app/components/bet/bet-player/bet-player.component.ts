import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { IPlayer } from 'src/app/models/player';
import { PersistenceService as PersistenceService } from 'src/app/services/persistence.service';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  map,
  of,
  takeUntil,
} from 'rxjs';
import { Router } from '@angular/router';

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
  transition('* => hide', [animate(250)]),
  transition('* => show', [animate(750)]),
]);

@Component({
  selector: 'bet-player',
  templateUrl: './bet-player.component.html',
  styleUrls: ['./bet-player.component.scss'],
  animations: [fadeAnimation],
})
export class BetPlayerComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
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

  private destroy$!: Subject<boolean>;
  private loadingData$!: BehaviorSubject<boolean>;
  private isHiding$!: BehaviorSubject<boolean>;

  public animationState!: string;

  public playersDisplayed!: IPlayer[];
  public playersReceived!: IPlayer[];

  public headerLabelReceived!: string;
  public headerLabelDisplayed!: string;

  public displayedColumns: string[] = ['winner', 'runnerUp', 'name'];

  public get withClubName(): boolean {
    return this.persistenceService.withClubName;
  }

  public set withClubName(withClubName: boolean) {
    this.persistenceService.withClubName = withClubName;
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();
    this.isHiding$ = new BehaviorSubject<boolean>(true);
    this.loadingData$ = new BehaviorSubject<boolean>(true);

    this.animationState = 'show';

    // Ecoute du store isLoadingData
    this.isLoadingData$
      .pipe(
        takeUntil(this.destroy$),
        map((isLoadingData) => {
          this.loadingData$.next(isLoadingData);
        })
      )
      .subscribe();

    this.loadingData$
      .pipe(
        takeUntil(this.destroy$),
        map((isLoadingData) => {
          if (isLoadingData) {
            // Début chargement de données
            this.animationState = 'hide';
            this.isHiding$.next(true);
          } else {
            // Fin de chargement des données
            if (this.isHiding$.value === false) {
              // L'animation de masquage est terminée, on peut donc afficher les données tout de suite
              // Cela arrive si le temps de masquage est très bas
              this.playersDisplayed = this.playersReceived;
              this.animationState = 'show';
            }
          }
        })
      )
      .subscribe();

    this.isHiding$
      .pipe(
        takeUntil(this.destroy$),
        map((isHiding) => {
          if (isHiding === false && this.loadingData$.value === false) {
            this.playersDisplayed = this.playersReceived;
            this.headerLabelDisplayed = this.headerLabelReceived;
            this.animationState = 'show';
          }
        })
      )
      .subscribe();

    combineLatest([this.contest$, this.category$, this.players$])
      .pipe(
        takeUntil(this.destroy$),
        map(([contest, category, players]) => {
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
    this.destroy$.next(true);
  }

  public animationDone($event: any) {
    // On vient de finir une animation qui peut-être le masquage ou l'affichage des données
    // Dans notre cas, on se concentre uniquement sur le masquage des données
    if ($event.toState === 'hide') {
      this.isHiding$.next(false);
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

  public calculate(bet: IBet | undefined) {
    this.persistenceService.categoryId = bet?.categoryId || 0;
    this.router.navigate(['bet-point']);
  }
}
