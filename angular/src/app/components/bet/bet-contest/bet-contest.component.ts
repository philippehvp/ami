import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
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
export class BetContestComponent implements OnInit, OnDestroy {
  @Select(BetState.contests)
  contests$!: Observable<IContest[]>;

  @Select(BetState.category)
  category$!: Observable<ICategory>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  private betsSub!: Subscription;
  private bets!: IBet[];

  private categorySub!: Subscription;
  private category!: ICategory;

  constructor(private store: Store) {}

  public changeCategory(categoryId: number) {
    this.store.dispatch([new BetActions.SetCategory(categoryId)]);
  }

  public getCategoryClass(category: ICategory): string {
    let ret: string = '';

    if (category) {
      // Recherche de la série dans les pronostics
      const bet = this.bets.find((bet) => {
        return bet.categoryId === category.id;
      });
      if (bet) {
        ret =
          bet.winnerId && bet.runnerUpId
            ? this.category?.id === category.id
              ? 'complete complete-selected'
              : 'complete'
            : this.category?.id === category.id
            ? 'uncomplete uncomplete-selected'
            : 'uncomplete';
      }
    }

    return ret;
  }

  public ngOnInit() {
    this.betsSub = this.bets$.subscribe((bets) => (this.bets = bets));
    this.categorySub = this.category$.subscribe(
      (category) => (this.category = category)
    );
  }

  public ngOnDestroy() {
    if (this.betsSub) {
      this.betsSub.unsubscribe();
    }

    if (this.categorySub) {
      this.categorySub.unsubscribe();
    }
  }
}
