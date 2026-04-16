import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { combineLatest, map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from '../../../models/bet';
import { ICategory } from '../../../models/category';
import { IContest } from '../../../models/contest';
import { BetActions } from '../../../store/action/bet.action';
import { BetState } from '../../../store/state/bet.state';
import { AsyncPipe } from '@angular/common';

type TData = {
  bets: IBet[];
  contests: IContest[];
  category: ICategory;
};

@Component({
  selector: 'bet-contest',
  templateUrl: './bet-contest.component.html',
  styleUrls: ['./bet-contest.component.scss'],
  imports: [AsyncPipe],
})
export class BetContestComponent implements OnInit {
  public contests$!: Observable<IContest[]>;
  public bets$!: Observable<IBet[]>;
  public category$!: Observable<ICategory>;

  public betIndex: number = 0;

  public data$!: Observable<TData>;

  constructor(private readonly store: Store) {
    this.contests$ = this.store.select(BetState.contests);
    this.bets$ = this.store.select(BetState.bets);
    this.category$ = this.store.select(BetState.category);
  }

  public ngOnInit() {
    this.data$ = combineLatest([
      this.bets$,
      this.contests$,
      this.category$,
    ]).pipe(
      map(([bets, contests, category]) => <TData>{ bets, contests, category }),
    );
  }

  public changeCategory(categoryId: number) {
    this.store.dispatch([new BetActions.SetCategory(categoryId)]);
  }

  public getCategoryClass(
    bets: IBet[],
    loopCategory: ICategory,
    category?: ICategory | null,
  ): string {
    if (loopCategory && bets) {
      // Recherche de la série dans les pronostics
      const bet = bets.find((bet) => {
        return bet.categoryId === loopCategory.id;
      });
      if (bet) {
        return bet?.isComplete
          ? category?.id === loopCategory.id
            ? 'complete complete-selected'
            : 'complete'
          : category?.id === loopCategory.id
            ? 'uncomplete uncomplete-selected'
            : 'uncomplete';
      }
    }

    return '';
  }

  public isCategoryComplete(category: ICategory | null, bets: IBet[]): boolean {
    if (category) {
      const b: IBet | undefined = bets.find((bet) => {
        return bet.categoryId === category.id;
      });

      return b && b.isComplete ? true : false;
    }

    return false;
  }

  public isCurrentCategory(
    category: ICategory | null,
    currentCategory: ICategory | null,
  ): boolean {
    return category && currentCategory
      ? category.id === currentCategory.id
      : false;
  }
}
