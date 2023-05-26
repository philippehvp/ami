import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, map, switchMap, takeUntil } from 'rxjs';
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
  private store = inject(Store);

  @Select(BetState.betterPoints)
  betterPoints$!: Observable<IBetterPoint[]>;

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  public displayedColumns: string[] = ['better', 'points'];

  public ngOnInit() {
    this.store.dispatch([new BetActions.CalculatePointsAndRanking()]);
  }

  public ngOnDestroy() {}
}
