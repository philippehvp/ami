import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, filter } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { IBetterPoint } from 'src/app/models/better-point';
import { BetterPointActions } from 'src/app/store/action/better-point.action';
import { BetState } from 'src/app/store/state/bet.state';
import { BetterPointState } from 'src/app/store/state/better-point.state';

@Component({
  selector: 'bet-point',
  templateUrl: './bet-point.component.html',
  styleUrls: ['./bet-point.component.scss'],
})
export class BetPointComponent implements OnInit, OnDestroy {
  @Select(BetterPointState.betterPoints)
  betterPoints$!: Observable<IBetterPoint[]>;

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  private betterSub!: Subscription;
  private better!: IBetter;

  public displayedColumns: string[];

  constructor(private store: Store) {
    this.displayedColumns = ['better', 'points'];
  }

  public ngOnInit() {
    this.betterSub = this.better$
      .pipe(filter((better) => !!better))
      .subscribe((better) => (this.better = better));
  }

  public ngOnDestroy() {
    if (this.betterSub) {
      this.betterSub.unsubscribe();
    }
  }

  public closeBetterPoints() {
    this.store.dispatch([
      new BetterPointActions.GetBetterPoint(this.better.accessKey, 0),
    ]);
  }
}
