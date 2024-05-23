import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Select, Store } from '@ngxs/store';
import { combineLatest, map, of, switchMap, takeUntil } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { CommonService } from 'src/app/services/common.service';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';

type TData = {
  bets: IBet[];
  contests: IContest[];
  category: ICategory;
};

@Component({
  selector: 'bet-contest',
  templateUrl: './bet-contest.component.html',
  styleUrls: ['./bet-contest.component.scss'],
})
export class BetContestComponent implements OnInit {
  private store = inject(Store);
  private commonService = inject(CommonService);
  private destroyRef: DestroyRef = inject(DestroyRef);

  @Select(BetState.contests)
  contests$!: Observable<IContest[]>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  @Select(BetState.category)
  category$!: Observable<ICategory>;

  public betIndex: number = 0;

  public data$!: Observable<TData>;

  public ngOnInit() {
    this.data$ = combineLatest([
      this.bets$,
      this.contests$,
      this.category$,
    ]).pipe(
      map(([bets, contests, category]) => <TData>{ bets, contests, category })
    );
  }

  public changeCategory(categoryId: number) {
    this.store.dispatch([new BetActions.SetCategory(categoryId)]);
  }

  public getCategoryClass(
    bets: IBet[],
    loopCategory: ICategory,
    category?: ICategory | null
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
    currentCategory: ICategory | null
  ): boolean {
    return category && currentCategory
      ? category.id === currentCategory.id
      : false;
  }
}
