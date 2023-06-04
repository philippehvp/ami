import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { IBetterRanking } from 'src/app/models/better-ranking';
import { BetterRankingActions } from 'src/app/store/action/better-ranking.action';
import { BetState } from 'src/app/store/state/bet.state';
import { BetterRankingState } from 'src/app/store/state/better-ranking.state';
import { BetReviewOfComponent } from '../bet/bet-review-of/bet-review-of.component';
import { PersistenceService } from 'src/app/services/persistence.service';

@Component({
  selector: 'better-ranking',
  templateUrl: './better-ranking.component.html',
  styleUrls: ['./better-ranking.component.scss'],
})
export class BetterRankingComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private persistenceService = inject(PersistenceService);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetterRankingState.bettersRanking)
  bettersRanking$!: Observable<IBetterRanking[]>;

  private destroy$!: Subject<boolean>;

  public displayedColumns: string[] = ['ranking', 'name', 'points'];

  public title!: string;

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.persistenceService.gobackPage = 'better-ranking';

    combineLatest([this.better$, this.route.data])
      .pipe(
        takeUntil(this.destroy$),
        map(([better, data]) => {
          this.title = data['byRanking'] ? 'Classement' : 'Récapitulatif';
          if (better) {
            this.store.dispatch([
              new BetterRankingActions.GetBetterRanking(
                better.accessKey,
                data['byRanking'] ? true : false
              ),
            ]);
          }
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  public showBetsReviewOf(randomKey: string) {
    const config: MatDialogConfig = {
      disableClose: true,
      data: randomKey,
    };

    this.dialog.open(BetReviewOfComponent, config);
  }
}
