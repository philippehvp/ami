import { Component, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IDuration } from '../../../models/duration';
import { PersistenceService } from '../../../services/persistence.service';
import { BetActions } from '../../../store/action/bet.action';
import { BetState } from '../../../store/state/bet.state';
import { MatSliderModule, MatSliderThumb } from '@angular/material/slider';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bet-duration',
  templateUrl: './bet-duration.component.html',
  styleUrls: ['./bet-duration.component.scss'],
  imports: [AsyncPipe, MatSliderModule, MatSliderThumb],
})
export class BetDurationComponent {
  public duration$!: Observable<IDuration>;

  constructor(
    private readonly store: Store,
    private readonly persistenceService: PersistenceService,
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
