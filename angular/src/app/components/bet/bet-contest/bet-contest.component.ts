import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
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

  constructor(private store: Store) {}

  public changeCategory(categoryId: number) {
    this.store.dispatch([new BetActions.SetCategory(categoryId)]);
  }

  public ngOnInit() {}

  public ngOnDestroy() {}
}
