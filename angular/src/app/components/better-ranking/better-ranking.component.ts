import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, filter } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { IBetterRanking } from 'src/app/models/better-ranking';
import { BetterRankingActions } from 'src/app/store/action/better-ranking.action';
import { BetState } from 'src/app/store/state/bet.state';
import { BetterRankingState } from 'src/app/store/state/better-ranking.state';

@Component({
  selector: 'better-ranking',
  templateUrl: './better-ranking.component.html',
  styleUrls: ['./better-ranking.component.scss'],
})
export class BetterRankingComponent implements OnInit, OnDestroy {
  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetterRankingState.bettersRanking)
  bettersRanking$!: Observable<IBetterRanking[]>;

  private betterSub!: Subscription;
  private routeSub!: Subscription;
  private better!: IBetter;

  public displayedColumns: string[] = [];

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.displayedColumns = ['ranking', 'name', 'points', 'duration'];
  }

  public ngOnInit() {
    this.betterSub = this.better$
      .pipe(filter((better) => !!better))
      .subscribe((better) => (this.better = better));

    this.routeSub = this.route.data.subscribe((data) => {
      this.store.dispatch([
        new BetterRankingActions.GetBetterRanking(
          this.better.accessKey,
          data['byRanking'] ? true : false
        ),
      ]);
    });
  }

  public ngOnDestroy() {
    if (this.betterSub) {
      this.betterSub.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
