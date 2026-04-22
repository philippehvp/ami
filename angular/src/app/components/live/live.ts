import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngxs/store';
import { UmpireActions } from '../../store/action/umpire.action';
import { Observable } from 'rxjs';
import { IPoint } from '../../models/point';
import { UmpireState } from '../../store/state/umpire.state';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Court } from '../court/court';

@Component({
  selector: 'live',
  imports: [AsyncPipe, MatButtonModule, MatIconModule, Court],
  templateUrl: './live.html',
  styleUrl: './live.scss',
})
export class Live {
  private readonly store: Store = inject(Store);

  public justPlayedPoint$: Observable<IPoint | undefined>;

  constructor() {
    this.justPlayedPoint$ = this.store.select(UmpireState.justPlayedPoint);
  }

  public addPointTeamLeft() {
    this.store.dispatch(new UmpireActions.AddPoint(true));
  }

  public addPointTeamRight() {
    this.store.dispatch(new UmpireActions.AddPoint(false));
  }
}
