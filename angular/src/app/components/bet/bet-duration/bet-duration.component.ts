import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IDuration } from 'src/app/models/duration';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'bet-duration',
  templateUrl: './bet-duration.component.html',
  styleUrls: ['./bet-duration.component.scss'],
})
export class BetDurationComponent {
  @Select(BetState.duration)
  duration$!: Observable<IDuration>;

  constructor(private store: Store) {}

  public changeDuration(duration: number) {
    this.store.dispatch([new BetActions.SetDuration(duration)]);
  }
}
