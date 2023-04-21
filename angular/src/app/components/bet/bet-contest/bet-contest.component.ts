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

  @Select(BetState.category)
  category$!: Observable<ICategory>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  public changeCategory(categoryId: number) {
    this.store.dispatch([new BetActions.SetCategory(categoryId)]);
  }

  public getCategoryClass(
    bets: IBet[],
    category: ICategory,
    currentCategory?: ICategory
  ): string {
    let ret: string = '';

    if (category && bets) {
      // Recherche de la série dans les pronostics
      const bet = bets.find((bet) => {
        return bet.categoryId === category.id;
      });
      if (bet) {
        ret =
          bet.winnerId && bet.runnerUpId
            ? currentCategory?.id === category.id
              ? 'complete complete-selected'
              : 'complete'
            : currentCategory?.id === category.id
            ? 'uncomplete uncomplete-selected'
            : 'uncomplete';
      }
    }

    return ret;
  }
}
