import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { UmpireActions } from '../../store/action/umpire.action';
import { IPoint } from '../../models/point';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'score-up-down',
  imports: [MatButtonModule],
  templateUrl: './score-up-down.html',
  styleUrl: './score-up-down.scss',
})
export class ScoreUpDown {
  private readonly store: Store = inject(Store);

  @Input()
  point!: IPoint;

  public addPointLeftPair() {
    this.store.dispatch(new UmpireActions.AddPoint(true));
  }

  public addPointRightPair() {
    this.store.dispatch(new UmpireActions.AddPoint(false));
  }
}
