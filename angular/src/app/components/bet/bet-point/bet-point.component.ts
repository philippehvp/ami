import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IBetter } from 'src/app/models/better';
import { IBetterPoint } from 'src/app/models/point';
import { BetterPointActions } from 'src/app/store/action/better-point.action';
import { BetState } from 'src/app/store/state/bet.state';
import { BetterPointState } from 'src/app/store/state/better-point.state';

@Component({
  selector: 'bet-point',
  templateUrl: './bet-point.component.html',
  styleUrls: ['./bet-point.component.scss'],
})
export class BetPointComponent {
  @Select(BetterPointState.betterPoints)
  betterPoints$!: Observable<IBetterPoint[]>;

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  public displayedColumns: string[];

  constructor(private store: Store) {
    this.displayedColumns = ['better', 'points'];
  }

  public closeBetterPoints() {
    this.store.dispatch([new BetterPointActions.CategoryToDisplay(0)]);
  }
}
