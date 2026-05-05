import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { UmpireActions } from '../../store/action/umpire.action';
import { IPoint } from '../../models/point';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'score-left-right',
  imports: [MatButtonModule],
  templateUrl: './score-left-right.html',
  styleUrl: './score-left-right.scss',
})
export class ScoreLeftRight {
  private readonly store: Store = inject(Store);

  @Input()
  point!: IPoint;

  constructor() {}

  public addPointLeftPair() {
    this.store.dispatch(new UmpireActions.AddPoint(true));
  }

  public addPointRightPair() {
    this.store.dispatch(new UmpireActions.AddPoint(false));
  }
}
