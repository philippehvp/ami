import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest, map, takeUntil } from 'rxjs';
import { IContest } from 'src/app/models/contest';
import { IBetReview } from 'src/app/models/review';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';

export interface ICategoryReview {
  categoryId: number;
  categoryShortName: string;
  winnerPlayerName1: string;
  winnerPlayerName2: string;
  runnerUpPlayerName1: string;
  runnerUpPlayerName2: string;
}

export interface IContestReview {
  contestName: string;
  categoryReview: ICategoryReview[];
}

@Component({
  selector: 'bet-review',
  templateUrl: './bet-review.component.html',
  styleUrls: ['./bet-review.component.scss'],
})
export class BetReviewComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private matDialogRef = inject(MatDialogRef<BetReviewComponent>);

  @Select(BetState.betsReview)
  betsReview$!: Observable<IBetReview[]>;

  @Select(BetState.contests)
  contests$!: Observable<IContest[]>;

  private destroy$!: Subject<boolean>;

  public contestsReview: IContestReview[] = [];

  public displayedColumns: string[] = ['category', 'player'];

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();

    this.store.dispatch([new BetActions.GetBetsReview()]);

    combineLatest([this.betsReview$, this.contests$])
      .pipe(
        takeUntil(this.destroy$),
        map(([betsReview, contests]) => {
          if (betsReview && betsReview.length && contests && contests.length) {
            // Fabrication du tableau à afficher, réparti par catégorie
            this.contestsReview = [];
            contests.map((contest) => {
              const betReviewsByContest = betsReview.filter((betReview) => {
                return betReview.contestId === contest.id;
              });

              const reviewCategory: ICategoryReview[] = [];
              betReviewsByContest.map((betReviewByContest) => {
                reviewCategory.push({
                  categoryId: betReviewByContest.categoryId,
                  categoryShortName: betReviewByContest.categoryShortName,
                  winnerPlayerName1: betReviewByContest.winnerPlayerName1,
                  winnerPlayerName2: betReviewByContest.winnerPlayerName2,
                  runnerUpPlayerName1: betReviewByContest.runnerUpPlayerName1,
                  runnerUpPlayerName2: betReviewByContest.runnerUpPlayerName2,
                });
              });

              this.contestsReview.push({
                contestName: contest.shortName,
                categoryReview: reviewCategory,
              });
            });
          }
        })
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  public close() {
    this.matDialogRef.close();
  }

  public showCategory(categoryId: number) {
    this.close();
    this.store.dispatch([new BetActions.SetCategory(categoryId)]);
  }
}
