import { Component, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetState } from 'src/app/store/state/bet.state';
import { BetActions } from 'src/app/store/action/bet.action';

export interface IToolbarOption {
  hasToolbar: boolean;
  isGobackToolbar: boolean;
}

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  private persistenceService = inject(PersistenceService);
  private store = inject(Store);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.completedBets)
  completedBets$!: Observable<number>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  public toggleSideNav() {
    if (this.persistenceService.sidenav) {
      this.persistenceService.sidenav.open();
    }
  }

  public toggleAbout() {
    if (this.persistenceService.aboutnav) {
      this.persistenceService.shuffleCredits();
      this.persistenceService.aboutnav.open();
    }
  }

  public showBetsReviewOf(better: IBetter | null) {
    if (better) {
      if (this.persistenceService.isReviewOfVisible) {
        this.persistenceService.isReviewOfVisible = false;
      } else {
        this.persistenceService.isReviewOfVisible = true;
        this.persistenceService.reviewOfBetterName = 'Mes pronostics';
        this.store.dispatch([new BetActions.GetBetsReviewOf(better.randomKey)]);
      }
    }
  }

  public get isShowBetsAvailable(): boolean {
    return true;
  }

  public get isToolbarLimitedMode(): boolean {
    return this.persistenceService.isToolbarLimitedMode;
  }

  public toggleCompactMode() {
    this.persistenceService.isCompactMode =
      !this.persistenceService.isCompactMode;
  }

  public get compactModeIcon(): string {
    return this.persistenceService.isCompactMode
      ? 'close_fullscreen'
      : 'open_in_full';
  }
}
