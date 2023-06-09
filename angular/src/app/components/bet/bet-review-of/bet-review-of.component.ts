import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { BetState } from 'src/app/store/state/bet.state';
import { IBetReviewOf } from 'src/app/models/bet-review-of';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetActions } from 'src/app/store/action/bet.action';

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
  selector: 'bet-review-of',
  templateUrl: './bet-review-of.component.html',
  styleUrls: ['./bet-review-of.component.scss'],
})
export class BetReviewOfComponent implements OnInit, OnDestroy {
  private persistenceService = inject(PersistenceService);
  private store = inject(Store);

  @Select(BetState.betsReviewOf)
  betsReviewOf$!: Observable<IBetReviewOf[]>;

  private destroy$!: Subject<boolean>;

  public get reviewOfBetterName(): string {
    return this.persistenceService.reviewOfBetterName;
  }

  public ngOnInit() {
    this.destroy$ = new Subject<boolean>();
  }

  public ngOnDestroy() {
    this.destroy$.next(true);
  }

  public hideReviewOf() {
    this.persistenceService.isReviewOfVisible = false;
    // RAZ des pronostics consultés
    this.store.dispatch([new BetActions.GetBetsReviewOf('')]);
  }

  public getPointsLabel(betsOfReview: IBetReviewOf): string {
    return betsOfReview.isCategoryDone
      ? betsOfReview.points
        ? betsOfReview.points + ' points'
        : betsOfReview.points.toString() + ' point'
      : '-';
  }

  public getPlayersName(playerName1: string, playerName2: string): string {
    if (playerName1 !== '-' && playerName2 !== '-') {
      return playerName1 + ' - ' + playerName2;
    }

    return '-';
  }
}
