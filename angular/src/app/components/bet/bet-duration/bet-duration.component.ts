import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IDuration } from 'src/app/models/duration';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';

@Component({
  selector: 'bet-duration',
  templateUrl: './bet-duration.component.html',
  styleUrls: ['./bet-duration.component.scss'],
})
export class BetDurationComponent {
  public duration$!: Observable<IDuration>;

  constructor(
    private readonly store: Store,
    private readonly persistenceService: PersistenceService
  ) {
    this.duration$ = this.store.select(BetState.duration);
  }

  public get isDurationCompactMode(): boolean {
    return this.persistenceService.isDurationCompactMode;
  }

  public get durationCompactModeIcon(): string {
    return this.persistenceService.isDurationCompactMode
      ? 'expand_more'
      : 'expand_less';
  }

  public toggleDurationCompactMode() {
    this.persistenceService.isDurationCompactMode =
      !this.persistenceService.isDurationCompactMode;
  }

  public changeDuration(duration: number) {
    this.store.dispatch([new BetActions.SetDuration(duration)]);
  }
}
