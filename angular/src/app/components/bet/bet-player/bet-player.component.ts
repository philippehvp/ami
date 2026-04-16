import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject, combineLatest, filter, map, takeUntil } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from '../../../models/bet';
import { IBetter } from '../../../models/better';
import { ICategory } from '../../../models/category';
import { IContest } from '../../../models/contest';
import { IPlayer } from '../../../models/player';
import { PersistenceService } from '../../../services/persistence.service';
import { UtilsService } from '../../../services/utils.service';
import { BetActions } from '../../../store/action/bet.action';
import { BetState } from '../../../store/state/bet.state';
import {
  MatCellDef,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule,
} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

type TData = {
  bet: IBet;
  better: IBetter;
  isLoadingData: boolean;
};

@Component({
  selector: 'bet-player',
  templateUrl: './bet-player.component.html',
  styleUrls: ['./bet-player.component.scss'],
  imports: [
    AsyncPipe,
    MatTable,
    MatTableModule,
    MatIcon,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
  ],
})
export class BetPlayerComponent implements OnInit, OnDestroy {
  public better$!: Observable<IBetter>;
  public bet$!: Observable<IBet>;
  public contest$!: Observable<IContest>;
  public category$!: Observable<ICategory>;
  public players$!: Observable<IPlayer[]>;
  public isLoadingData$: Observable<boolean>;
  public data$!: Observable<TData>;

  private destroy$!: Subject<boolean>;

  public playersDisplayed!: IPlayer[];

  public headerContestLabelDisplayed!: string;
  public headerCategoryLabelDisplayed!: string;

  public displayedColumns: string[] = ['name', 'winner', 'runnerUp'];
  public displayedColumnsReverse: string[] = ['winner', 'runnerUp', 'name'];

  constructor(
    private readonly store: Store,
    private readonly persistenceService: PersistenceService,
    private readonly utilsService: UtilsService,
  ) {
    this.better$ = this.store.select(BetState.better);
    this.bet$ = this.store.select(BetState.bet);
    this.contest$ = this.store.select(BetState.contest);
    this.category$ = this.store.select(BetState.category);
    this.players$ = this.store.select(BetState.players);
    this.isLoadingData$ = this.store.select(BetState.isLoadingData);
  }

  public get isClubName() {
    return this.persistenceService.isClubName;
  }

  public set isClubName(isClubName: boolean) {
    this.persistenceService.isClubName = isClubName;
  }

  public get isPlayerReverse(): boolean {
    return this.persistenceService.isPlayerReverse;
  }

  public set isPlayerReverse(isPlayerReverse: boolean) {
    this.persistenceService.isPlayerReverse = isPlayerReverse;
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    combineLatest([this.contest$, this.category$, this.players$])
      .pipe(
        takeUntil(this.destroy$),
        filter(
          ([contest, category, players]) =>
            !!contest && !!category && !!players,
        ),
        map(([contest, category, players]) => {
          if (contest && category) {
            this.headerContestLabelDisplayed = contest.longName;
            this.headerCategoryLabelDisplayed = category.longName;
          }

          this.playersDisplayed = players;
        }),
      )
      .subscribe();

    this.data$ = combineLatest([
      this.bet$,
      this.better$,
      this.isLoadingData$,
    ]).pipe(
      map(([bet, better, isLoadingData]) => {
        return {
          bet,
          better,
          isLoadingData,
        };
      }),
    );
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  public isWinnerChecked(bet: IBet | undefined, playerId: number): boolean {
    return playerId === bet?.winnerId;
  }

  public isRunnerUpChecked(bet: IBet | undefined, playerId: number): boolean {
    return playerId === bet?.runnerUpId;
  }

  public winnerIconLabel(bet: IBet | undefined, playerId: number): string {
    if (this.isWinnerChecked(bet, playerId)) {
      return 'radio_button_checked';
    }
    return 'radio_button_unchecked';
  }

  public runnerUpIconLabel(bet: IBet | undefined, playerId: number): string {
    if (this.isRunnerUpChecked(bet, playerId)) {
      return 'radio_button_checked';
    }
    return 'radio_button_unchecked';
  }

  public changeWinner(playerId: number) {
    this.store.dispatch([new BetActions.SetWinner(playerId)]);
  }

  public changeRunnerUp(playerId: number) {
    this.store.dispatch([new BetActions.SetRunnerUp(playerId)]);
  }

  public firstPlayerLabel(player: IPlayer): string {
    return this.utilsService.firstPlayerLabel(player);
  }

  public secondPlayerLabel(player: IPlayer): string {
    return this.utilsService.secondPlayerLabel(player);
  }

  public firstPlayerClub(player: IPlayer): string {
    return this.utilsService.firstPlayerClub(player);
  }

  public secondPlayerClub(player: IPlayer): string {
    return this.utilsService.secondPlayerClub(player);
  }

  public calculate(bet: IBet | undefined) {
    this.persistenceService.categoryId = bet?.categoryId || 0;
    this.persistenceService.navigate('bet-point');
  }
}
