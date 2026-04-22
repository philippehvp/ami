import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Points } from '../points/points';
import { IMatch } from '../../models/match';
import { Observable } from 'rxjs';
import { UmpireState } from '../../store/state/umpire.state';
import { Store } from '@ngxs/store';
import { AsyncPipe } from '@angular/common';
import { ISet } from '../../models/set';

@Component({
  selector: 'history',
  imports: [AsyncPipe, MatTabsModule, Points],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History {
  private readonly store: Store = inject(Store);

  public match$: Observable<IMatch>;
  public firstSet$: Observable<ISet>;
  public secondSet$: Observable<ISet>;
  public thirdSet$: Observable<ISet>;

  constructor() {
    this.match$ = this.store.select(UmpireState.match);
    this.firstSet$ = this.store.select(UmpireState.firstSet);
    this.secondSet$ = this.store.select(UmpireState.secondSet);
    this.thirdSet$ = this.store.select(UmpireState.thirdSet);
  }

  public isSetHasPoint(set: ISet): boolean {
    return set.points && set.points.length > 0;
  }
}
