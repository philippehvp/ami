import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  Observable,
  Subject,
  combineLatest,
  filter,
  map,
  takeUntil,
} from 'rxjs';
import { IBetter } from '../../models/better';
import { IBetterRanking, IRanking } from '../../models/better-ranking';
import {
  IInformationDialogConfig,
  InformationDialogType,
} from '../../models/information-dialog-type';
import { PersistenceService } from '../../services/persistence.service';
import { ThemeService } from '../../services/theme.service';
import { BetActions } from '../../store/action/bet.action';
import { BetState } from '../../store/state/bet.state';
import { InformationComponent } from '../information/information.component';
import {
  MatCellDef,
  MatHeaderCellDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { BetReviewOfComponent } from '../bet/bet-review-of/bet-review-of.component';
import { SettingComponent } from '../setting/setting.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';

type TData = {
  better: IBetter;
  bettersRanking: IBetterRanking | undefined;
};

@Component({
  selector: 'better-ranking',
  templateUrl: './better-ranking.component.html',
  styleUrls: ['./better-ranking.component.scss'],
  imports: [
    AsyncPipe,
    MatTable,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    BetReviewOfComponent,
    SettingComponent,
    MatProgressBar,
  ],
})
export class BetterRankingComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public better$!: Observable<IBetter>;
  public bettersRanking$!: Observable<IBetterRanking | undefined>;
  public isOffline$!: Observable<boolean>;

  private destroy$!: Subject<boolean>;

  private interval!: any;
  public seconds!: number;
  private longIntervalDuration: number = 30;
  public isRefreshSuspended: boolean = false;
  public spinnerValue!: number;
  private byRanking!: boolean;
  private day = 0;

  private isRefreshLaunched = false;

  public title!: string;

  public displayedColumns: string[] = ['ranking', 'name', 'points', 'duration'];

  public data$!: Observable<TData>;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly persistenceService: PersistenceService,
    private readonly renderer: Renderer2,
    private readonly themeService: ThemeService,
    private readonly route: ActivatedRoute,
  ) {
    this.better$ = this.store.select(BetState.better);
    this.bettersRanking$ = this.store.select(BetState.bettersRanking);
    this.isOffline$ = this.store.select(BetState.isOffline);
  }

  public get isReviewOfVisible(): boolean {
    return this.persistenceService.isReviewOfVisible;
  }

  public get expandPanelClass(): string {
    return this.persistenceService.isCompactMode
      ? 'compact-mode'
      : 'normal-mode';
  }

  public getCompletedCategories(
    betterRankings: IBetterRanking | undefined,
  ): number {
    if (betterRankings) {
      return betterRankings.completedCategories;
    }

    return 0;
  }

  public getCountOfCategories(
    betterRankings: IBetterRanking | undefined,
  ): number {
    if (betterRankings) {
      return betterRankings.countOfCategories;
    }

    return 0;
  }

  public getDataSource(bettersRanking: IBetterRanking | undefined): IRanking[] {
    if (bettersRanking && bettersRanking.rankings) {
      return bettersRanking.rankings;
    }

    return [];
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    combineLatest([this.better$, this.route.data])
      .pipe(
        takeUntil(this.destroy$),
        filter(([better, data]) => !!better && !!data),
        map(([better, data]) => {
          if (better && data) {
            this.themeService.setTheme(
              this.renderer,
              this.persistenceService.theme,
            );

            this.byRanking = data && data['byRanking'] === 1;
            this.day = data['day'];

            this.seconds = this.longIntervalDuration;

            this.persistenceService.gobackPage =
              this.day === 1 ? 'better-ranking1' : 'better-ranking2';

            const dayTitle = this.day === 1 ? 'DH/DD' : 'DMx';

            this.title =
              data && data['byRanking'] === 1
                ? `Classement des joueurs ${dayTitle}`
                : `Nombre de points ${dayTitle}`;

            this.store.dispatch([
              new BetActions.GetBetterRanking(this.byRanking, this.day),
            ]);

            if (!this.isRefreshLaunched) {
              this.launchAutoRefresh();
              this.isRefreshLaunched = true;
            }
          }
        }),
      )
      .subscribe();

    this.isOffline$
      .pipe(
        takeUntil(this.destroy$),
        filter((isOffline) => isOffline !== undefined),
        map((isOffline) => {
          if (isOffline) {
            const config: MatDialogConfig<IInformationDialogConfig> = {
              data: {
                title: 'Session expirée',
                message: 'Ta session est expirée. Merci de te reconnecter.',
                dialogType: InformationDialogType.Information,
                labels: ['Me connecter'],
              },
              disableClose: true,
            };

            this.dialog
              .open(InformationComponent, config)
              .afterClosed()
              .subscribe(() => {
                return this.persistenceService.navigate('relog');
              });
          }
        }),
      )
      .subscribe();

    this.data$ = combineLatest([this.better$, this.bettersRanking$]).pipe(
      map(([better, bettersRanking]) => ({
        better,
        bettersRanking,
      })),
    );
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  public ngAfterViewInit() {
    const toolbarHeight =
      document.querySelector('.toolbar-panel')?.clientHeight || 0;
    const settingHeight =
      document.querySelector('.setting-panel')?.clientHeight || 0;

    const expandHeightNormal = `${
      window.innerHeight - (toolbarHeight + settingHeight)
    }`;
    const expandHeightCompact = `${window.innerHeight - toolbarHeight}`;

    document.documentElement.style.setProperty(
      '--expand-height-normal',
      `${expandHeightNormal}px`,
    );

    document.documentElement.style.setProperty(
      '--expand-height-compact',
      `${expandHeightCompact}px`,
    );
  }

  public showBetsReviewOf(ranking: IRanking, better: IBetter | null) {
    this.store.dispatch([new BetActions.GetBetsReviewOf(ranking.randomKey)]);

    if (better) {
      this.persistenceService.reviewOfBetterName =
        ranking.randomKey === better.randomKey
          ? 'Mes pronostics'
          : 'Pronostics de ' + ranking.name + ' ' + ranking.firstName;
    } else {
      this.persistenceService.reviewOfBetterName = '?';
    }
    this.persistenceService.isReviewOfVisible = true;
  }

  public getRankingBetterName(
    ranking: IRanking,
    better: IBetter | null,
  ): string {
    if (ranking && better) {
      return ranking.randomKey === better.randomKey
        ? 'Moi'
        : ranking.name + ' ' + ranking.firstName;
    }

    return '?';
  }

  public toggleRefresh() {
    this.isRefreshSuspended = !this.isRefreshSuspended;
  }

  private launchAutoRefresh() {
    this.interval = setInterval(() => {
      if (!this.isRefreshSuspended) {
        this.seconds--;
        this.spinnerValue =
          100 -
          ((this.longIntervalDuration - this.seconds) /
            this.longIntervalDuration) *
            100;

        if (this.seconds === 0) {
          if (this.day !== 0) {
            this.store.dispatch([
              new BetActions.GetBetterRanking(this.byRanking, this.day),
            ]);
          }
          this.seconds = this.longIntervalDuration;
        }
      }
    }, 1000);
  }
}
