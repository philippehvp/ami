import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IBetReviewOf } from '../../../models/bet-review-of';
import { IPlayer } from '../../../models/better-bet';
import { IPlayerForReviewOf } from '../../../models/player';
import { PersistenceService } from '../../../services/persistence.service';
import { UtilsService } from '../../../services/utils.service';
import { BetActions } from '../../../store/action/bet.action';
import { BetState } from '../../../store/state/bet.state';
import { AsyncPipe } from '@angular/common';

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
  imports: [AsyncPipe],
})
export class BetReviewOfComponent {
  public betsReviewOf$!: Observable<IBetReviewOf[]>;

  constructor(
    private readonly persistenceService: PersistenceService,
    private readonly store: Store,
    private readonly utilsService: UtilsService,
  ) {
    this.betsReviewOf$ = this.store.select(BetState.betsReviewOf);
  }

  public get isClubName() {
    return this.persistenceService.isClubName;
  }

  public get reviewOfBetterName(): string {
    return this.persistenceService.reviewOfBetterName;
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

  public firstPlayerLabel(player: IPlayer): string {
    return this.utilsService.firstPlayerLabel(<IPlayerForReviewOf>player);
  }

  public secondPlayerLabel(player: IPlayer): string {
    return this.utilsService.secondPlayerLabel(<IPlayerForReviewOf>player);
  }

  public firstPlayerClub(player: IPlayer): string {
    return this.utilsService.firstPlayerClub(<IPlayerForReviewOf>player);
  }

  public secondPlayerClub(player: IPlayer): string {
    return this.utilsService.secondPlayerClub(<IPlayerForReviewOf>player);
  }
}
