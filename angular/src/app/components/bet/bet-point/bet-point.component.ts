import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { IBetterPoint } from 'src/app/models/better-point';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'bet-point',
  templateUrl: './bet-point.component.html',
  styleUrls: ['./bet-point.component.scss'],
})
export class BetPointComponent implements OnInit, OnDestroy {
  public betterPoints$!: Observable<IBetterPoint[]>;
  public better$!: Observable<IBetter>;

  public displayedColumns: string[] = ['better', 'points'];

  constructor(private readonly store: Store) {
    this.betterPoints$ = this.store.select(BetState.betterPoints);
    this.better$ = this.store.select(BetState.better);
  }

  public ngOnInit() {
    this.store.dispatch([new BetActions.CalculatePointsAndRanking()]);
  }

  public ngOnDestroy() {}
}
