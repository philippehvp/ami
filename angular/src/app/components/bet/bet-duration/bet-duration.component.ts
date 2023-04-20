import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IDuration } from 'src/app/models/duration';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'bet-duration',
  templateUrl: './bet-duration.component.html',
  styleUrls: ['./bet-duration.component.scss'],
})
export class BetDurationComponent implements OnInit, OnDestroy {
  @Select(BetState.duration)
  duration$!: Observable<IDuration>;

  private durationSub!: Subscription;

  constructor(private store: Store) {}

  public ngOnInit() {
    this.durationSub = this.duration$.subscribe((duration) =>
      console.log(duration)
    );
  }

  public ngOnDestroy() {
    if (this.durationSub) {
      this.durationSub.unsubscribe();
    }
  }

  public changeDuration(duration: number) {
    this.store.dispatch([new BetActions.SetDuration(duration)]);
  }
}
