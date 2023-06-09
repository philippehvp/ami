import { Component, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { ICategory } from 'src/app/models/category';
import { IContest } from 'src/app/models/contest';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'bet-contest',
  templateUrl: './bet-contest.component.html',
  styleUrls: ['./bet-contest.component.scss'],
})
export class BetContestComponent {
  private store = inject(Store);

  @Select(BetState.contests)
  contests$!: Observable<IContest[]>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  @Select(BetState.category)
  category$!: Observable<ICategory>;

  public betIndex: number = 0;

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
