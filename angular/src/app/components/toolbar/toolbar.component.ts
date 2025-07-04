import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { combineLatest, map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IBet } from 'src/app/models/bet';
import { IBetter } from 'src/app/models/better';
import { PersistenceService } from 'src/app/services/persistence.service';
import { BetActions } from 'src/app/store/action/bet.action';
import { BetState } from 'src/app/store/state/bet.state';

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
  public better$!: Observable<IBetter>;
  public completedBets$!: Observable<number>;
  public bets$!: Observable<IBet[]>;

  public data$!: Observable<TData>;

  constructor(
    private readonly persistenceService: PersistenceService,
    private readonly store: Store
  ) {
    this.better$ = this.store.select(BetState.better);
    this.completedBets$ = this.store.select(BetState.completedBets);
    this.bets$ = this.store.select(BetState.bets);
  }

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
