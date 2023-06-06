import { Component, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { IBetterRanking } from 'src/app/models/better-ranking';
import { BetState } from 'src/app/store/state/bet.state';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetActions } from 'src/app/store/action/bet.action';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'better-ranking',
  templateUrl: './better-ranking.component.html',
  styleUrls: ['./better-ranking.component.scss'],
})
export class BetterRankingComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private persistenceService = inject(PersistenceService);
  private renderer = inject(Renderer2);
  private utilsService = inject(UtilsService);
  private route = inject(ActivatedRoute);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.bettersRanking)
  bettersRanking$!: Observable<IBetterRanking[]>;

  private destroy$!: Subject<boolean>;

  private interval!: any;
  public seconds!: number;
  private longIntervalDuration: number = 30;
  public isRefreshSuspended: boolean = false;
  public spinnerValue!: number;
  private byRanking!: boolean;

  public title!: string;

  public displayedColumns: string[] = ['ranking', 'name', 'points'];

  public get isReviewOfVisible(): boolean {
    return this.persistenceService.isReviewOfVisible;
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.persistenceService.gobackPage = 'better-ranking';
    this.seconds = this.longIntervalDuration;

    this.interval = setInterval(() => {
      if (!this.isRefreshSuspended) {
        this.seconds--;
        this.spinnerValue =
          100 -
          ((this.longIntervalDuration - this.seconds) /
            this.longIntervalDuration) *
            100;

        if (this.seconds === 0) {
          this.store.dispatch([
            new BetActions.GetBetterRanking(this.byRanking),
          ]);
          this.seconds = this.longIntervalDuration;
        }
      }
    }, 1000);

    combineLatest([this.better$, this.route.data])
      .pipe(
        takeUntil(this.destroy$),
        map(([better, route]) => {
          if (better && route) {
            this.utilsService.setMode(
              this.renderer,
              this.persistenceService.isDarkMode
            );

            this.byRanking = route && route['byRanking'] === 1;
            this.title =
              route && route['byRanking'] === 1
                ? 'Classement des joueurs'
                : 'Nombre de points';

            this.store.dispatch([
              new BetActions.GetBetterRanking(this.byRanking),
            ]);
          }
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  public showBetsReviewOf(
    betterRanking: IBetterRanking,
    better: IBetter | null
  ) {
    this.store.dispatch([
      new BetActions.GetBetsReviewOf(betterRanking.randomKey),
    ]);

    if (better) {
      this.persistenceService.reviewOfBetterName =
        betterRanking.randomKey === better.randomKey
          ? 'Mes pronostics'
          : 'Pronostics de ' +
            betterRanking.name +
            ' ' +
            betterRanking.firstName;
    } else {
      this.persistenceService.reviewOfBetterName = '?';
    }
    this.persistenceService.isReviewOfVisible = true;
  }

  public getRankingBetterName(
    betterRanking: IBetterRanking,
    better: IBetter | null
  ): string {
    if (betterRanking && better) {
      return betterRanking.randomKey === better.randomKey
        ? 'Moi'
        : betterRanking.name + ' ' + betterRanking.firstName;
    }

    return '?';
  }

  public toggleRefresh() {
    this.isRefreshSuspended = !this.isRefreshSuspended;
  }
}
