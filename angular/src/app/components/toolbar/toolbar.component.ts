import { Component, OnInit, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetState } from 'src/app/store/state/bet.state';
import { BetActions } from 'src/app/store/action/bet.action';
import { combineLatest, map } from 'rxjs';

export interface IToolbarOption {
  hasToolbar: boolean;
  isGobackToolbar: boolean;
}

type TData = {
  better: IBetter;
  bets: IBet[];
  completedBets: number;
};

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  private persistenceService = inject(PersistenceService);
  private store = inject(Store);

  @Select(BetState.better)
  better$!: Observable<IBetter>;

  @Select(BetState.completedBets)
  completedBets$!: Observable<number>;

  @Select(BetState.bets)
  bets$!: Observable<IBet[]>;

  public data$!: Observable<TData>;

  public ngOnInit() {
    this.data$ = combineLatest([
      this.better$,
      this.bets$,
      this.completedBets$,
    ]).pipe(
      map(([better, bets, completedBets]) => ({
        better,
        bets,
        completedBets,
      }))
    );
  }

  public toggleSideNav() {
    if (this.persistenceService.sidenav) {
      this.persistenceService.sidenav.open();
    }
  }

  public toggleAbout() {
    if (this.persistenceService.aboutnav) {
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

  public get logoClass(): string {
    return this.persistenceService.theme.logoColor;
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
